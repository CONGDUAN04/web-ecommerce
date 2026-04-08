import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from "../../utils/AppError.js";
import {
  adminOrderDetailSelect,
  adminOrderListSelect,
} from "../../select/order.select.js";
// ========================
// STATE MACHINE
// ========================
const VALID_TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["COMPLETED", "CANCELLED"],
  COMPLETED: ["RETURN_REQUESTED"],
  RETURN_REQUESTED: ["RETURN_APPROVED", "COMPLETED"],
  RETURN_APPROVED: ["RETURNED"],
  RETURNED: [],
  CANCELLED: [],
};
const validateTransition = (current, next) => {
  if (!VALID_TRANSITIONS[current]?.includes(next)) {
    throw new ValidationError(
      `Không thể chuyển trạng thái từ "${current}" sang "${next}"`,
    );
  }
};
// ========================
// HELPER
// ========================
const findOrderOrThrow = async (id, include = {}) => {
  const order = await prisma.order.findUnique({ where: { id }, ...include });
  if (!order) throw new NotFoundError("Đơn hàng");
  return order;
};
// ========================
// SERVICES
// ========================
export const getOrdersServices = async ({
  page = 1,
  limit = 10,
  status,
  paymentStatus,
  paymentMethod,
  userId,
  keyword,
  from,
  to,
}) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const where = {
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
    ...(paymentMethod && { paymentMethod }),
    ...(userId && { userId: Number(userId) }),
    ...(from || to
      ? {
          createdAt: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }
      : {}),
    ...(keyword && {
      OR: [
        { receiverName: { contains: keyword, mode: "insensitive" } },
        { receiverPhone: { contains: keyword, mode: "insensitive" } },
        { trackingCode: { contains: keyword, mode: "insensitive" } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      select: adminOrderListSelect,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    items,
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  };
};

export const getOrderByIdServices = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    select: adminOrderDetailSelect,
  });
  if (!order) throw new NotFoundError("Đơn hàng");
  return order;
};

export const confirmOrderServices = async (id) => {
  id = Number(id);
  const order = await findOrderOrThrow(id);
  validateTransition(order.status, "CONFIRMED");

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id }, data: { status: "CONFIRMED" } });
    await tx.notification.create({
      data: {
        userId: order.userId,
        type: "ORDER",
        title: "Đơn hàng đã được xác nhận",
        content: `Đơn hàng #${id} của bạn đã được xác nhận và đang được chuẩn bị.`,
        link: `/orders/${id}`,
      },
    });
  });

  return getOrderByIdServices(id);
};

export const shipOrderServices = async (id, { trackingCode }) => {
  id = Number(id);
  const order = await findOrderOrThrow(id);
  validateTransition(order.status, "SHIPPING");

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: { status: "SHIPPING", ...(trackingCode && { trackingCode }) },
    });
    await tx.notification.create({
      data: {
        userId: order.userId,
        type: "ORDER",
        title: "Đơn hàng đang được giao",
        content: `Đơn hàng #${id} đang trên đường giao đến bạn.${trackingCode ? ` Mã vận đơn: ${trackingCode}` : ""}`,
        link: `/orders/${id}`,
      },
    });
  });

  return getOrderByIdServices(id);
};

export const completeOrderServices = async (id) => {
  id = Number(id);
  const order = await findOrderOrThrow(id);
  validateTransition(order.status, "COMPLETED");

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: {
        status: "COMPLETED",
        ...(order.paymentStatus === "PENDING" && { paymentStatus: "SUCCESS" }),
      },
    });
    await tx.notification.create({
      data: {
        userId: order.userId,
        type: "ORDER",
        title: "Đơn hàng hoàn thành",
        content: `Đơn hàng #${id} đã được giao thành công. Cảm ơn bạn đã mua hàng!`,
        link: `/orders/${id}`,
      },
    });
  });

  return getOrderByIdServices(id);
};

export const cancelOrderServices = async (id, { cancelReason }) => {
  id = Number(id);
  const order = await findOrderOrThrow(id, {
    include: { orderItems: { select: { variantId: true, quantity: true } } },
  });
  validateTransition(order.status, "CANCELLED");

  await prisma.$transaction(async (tx) => {
    for (const item of order.orderItems) {
      const variant = await tx.variant.findUnique({
        where: { id: item.variantId },
        select: { quantity: true },
      });
      const quantityBefore = variant.quantity;
      const quantityAfter = quantityBefore + item.quantity;

      await tx.variant.update({
        where: { id: item.variantId },
        data: { quantity: quantityAfter },
      });
      await tx.inventoryLog.create({
        data: {
          action: "IMPORT",
          quantity: item.quantity,
          quantityBefore,
          quantityAfter,
          note: `Hoàn kho do huỷ đơn #${id}`,
          variantId: item.variantId,
        },
      });
    }

    await tx.order.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelReason: cancelReason ?? null,
        paymentStatus:
          order.paymentStatus === "SUCCESS"
            ? "REFUNDED"
            : order.paymentStatus === "PENDING"
              ? "FAILED"
              : order.paymentStatus,
      },
    });

    await tx.notification.create({
      data: {
        userId: order.userId,
        type: "ORDER",
        title: "Đơn hàng đã bị huỷ",
        content: `Đơn hàng #${id} đã bị huỷ.${cancelReason ? ` Lý do: ${cancelReason}` : ""}`,
        link: `/orders/${id}`,
      },
    });
  });

  return getOrderByIdServices(id);
};
// ========================
// RETURN FLOW
// ========================
export const approveReturnServices = async (
  id,
  { refundAmount, adminNote },
) => {
  id = Number(id);
  const order = await findOrderOrThrow(id, {
    include: {
      returnRequest: {
        include: {
          returnItems: {
            select: {
              orderItemId: true,
              quantity: true,
              isRestockable: true,
              orderItem: { select: { variantId: true } },
            },
          },
        },
      },
    },
  });

  validateTransition(order.status, "RETURN_APPROVED");

  const returnRequest = order.returnRequest;
  if (!returnRequest) throw new NotFoundError("Yêu cầu hoàn trả");
  if (returnRequest.isApproved !== null)
    throw new ConflictError("Yêu cầu hoàn trả đã được xử lý trước đó");

  await prisma.$transaction(async (tx) => {
    await tx.returnRequest.update({
      where: { id: returnRequest.id },
      data: {
        isApproved: true,
        refundAmount,
        adminNote: adminNote ?? null,
        resolvedAt: new Date(),
      },
    });

    for (const item of returnRequest.returnItems) {
      if (!item.isRestockable) continue;

      const variant = await tx.variant.findUnique({
        where: { id: item.orderItem.variantId },
        select: { quantity: true },
      });
      const quantityBefore = variant.quantity;
      const quantityAfter = quantityBefore + item.quantity;

      await tx.variant.update({
        where: { id: item.orderItem.variantId },
        data: { quantity: quantityAfter },
      });
      await tx.inventoryLog.create({
        data: {
          action: "RETURN",
          quantity: item.quantity,
          quantityBefore,
          quantityAfter,
          note: `Nhập kho do hoàn hàng đơn #${id}`,
          variantId: item.orderItem.variantId,
          returnRequestId: returnRequest.id,
        },
      });
    }

    await tx.payment.upsert({
      where: { orderId: id },
      update: { refundAmount },
      create: {
        orderId: id,
        amount: order.finalPrice,
        provider: order.paymentMethod,
        status: "PENDING",
        refundAmount,
      },
    });

    await tx.order.update({
      where: { id },
      data: { status: "RETURN_APPROVED" },
    });

    await tx.notification.create({
      data: {
        userId: order.userId,
        type: "RETURN",
        title: "Yêu cầu hoàn trả được duyệt",
        content: `Yêu cầu hoàn trả đơn hàng #${id} đã được duyệt. Số tiền hoàn: ${refundAmount.toLocaleString("vi-VN")}đ.`,
        link: `/orders/${id}`,
      },
    });
  });

  return getOrderByIdServices(id);
};

export const rejectReturnServices = async (id, { adminNote }) => {
  id = Number(id);
  const order = await findOrderOrThrow(id, {
    include: { returnRequest: { include: { returnItems: true } } },
  });

  validateTransition(order.status, "COMPLETED");

  const returnRequest = order.returnRequest;
  if (!returnRequest) throw new NotFoundError("Yêu cầu hoàn trả");
  if (returnRequest.isApproved !== null)
    throw new ConflictError("Yêu cầu hoàn trả đã được xử lý trước đó");

  await prisma.$transaction(async (tx) => {
    await tx.returnRequest.update({
      where: { id: returnRequest.id },
      data: { isApproved: false, adminNote, resolvedAt: new Date() },
    });
    await tx.order.update({ where: { id }, data: { status: "COMPLETED" } });
    await tx.notification.create({
      data: {
        userId: order.userId,
        type: "RETURN",
        title: "Yêu cầu hoàn trả bị từ chối",
        content: `Yêu cầu hoàn trả đơn hàng #${id} đã bị từ chối.${adminNote ? ` Lý do: ${adminNote}` : ""}`,
        link: `/orders/${id}`,
      },
    });
  });

  return getOrderByIdServices(id);
};

export const completeReturnServices = async (
  id,
  { refundId, refundNote } = {},
) => {
  id = Number(id);
  const order = await findOrderOrThrow(id);
  validateTransition(order.status, "RETURNED");

  await prisma.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: { orderId: id },
      update: {
        status: "REFUNDED",
        ...(refundId && { refundId }),
        ...(refundNote && { refundNote }),
      },
      create: {
        orderId: id,
        amount: order.finalPrice,
        provider: order.paymentMethod,
        status: "REFUNDED",
        ...(refundId && { refundId }),
        ...(refundNote && { refundNote }),
      },
    });

    await tx.order.update({
      where: { id },
      data: { status: "RETURNED", paymentStatus: "REFUNDED" },
    });

    await tx.notification.create({
      data: {
        userId: order.userId,
        type: "RETURN",
        title: "Hoàn tiền thành công",
        content: `Đơn hàng #${id} đã được hoàn trả thành công. Tiền đã được hoàn về tài khoản của bạn.`,
        link: `/orders/${id}`,
      },
    });
  });

  return getOrderByIdServices(id);
};
