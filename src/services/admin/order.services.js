import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";

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
    throw new Error(
      `Không thể chuyển trạng thái từ "${current}" sang "${next}"`,
    );
  }
};

// ========================
// SELECT HELPERS
// ========================
const orderListSelect = {
  id: true,
  subtotal: true,
  discountAmount: true,
  shippingFee: true,
  finalPrice: true,
  receiverName: true,
  receiverPhone: true,
  status: true,
  paymentMethod: true,
  paymentStatus: true,
  trackingCode: true,
  createdAt: true,
  user: {
    select: { id: true, username: true, fullName: true },
  },
  voucher: {
    select: { id: true, code: true },
  },
  _count: {
    select: { orderItems: true },
  },
};

const orderDetailSelect = {
  ...orderListSelect,
  receiverAddress: true,
  note: true,
  cancelReason: true,
  updatedAt: true,
  orderItems: {
    select: {
      id: true,
      quantity: true,
      price: true,
      productName: true,
      variantColor: true,
      variantStorage: true,
      variantSku: true,
      thumbnail: true,
      variant: {
        select: { id: true, sku: true, color: true },
      },
    },
  },
  // 1:1
  payment: {
    select: {
      id: true,
      amount: true,
      provider: true,
      status: true,
      transactionId: true,
      refundAmount: true,
      refundId: true,
      refundNote: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  // 1:1
  returnRequest: {
    select: {
      id: true,
      reason: true,
      note: true,
      evidence: true,
      adminNote: true,
      refundAmount: true,
      isApproved: true,
      resolvedAt: true,
      createdAt: true,
      returnItems: {
        select: {
          id: true,
          quantity: true,
          reason: true,
          isRestockable: true,
          orderItem: {
            select: {
              id: true,
              productName: true,
              variantColor: true,
              variantStorage: true,
              variantSku: true,
            },
          },
        },
      },
    },
  },
};

// ========================
// HELPER
// ========================
const findOrderOrThrow = async (id, include = {}) => {
  const order = await prisma.order.findUnique({ where: { id }, ...include });
  if (!order) throw new Error("Đơn hàng không tồn tại");
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
        { receiverName: { contains: keyword } },
        { receiverPhone: { contains: keyword } },
        { trackingCode: { contains: keyword } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      select: orderListSelect,
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
    select: orderDetailSelect,
  });
  if (!order) throw new Error("Đơn hàng không tồn tại");
  return order;
};

export const confirmOrderServices = async (id) => {
  id = Number(id);
  const order = await findOrderOrThrow(id);
  validateTransition(order.status, "CONFIRMED");

  return prisma.order.update({
    where: { id },
    data: { status: "CONFIRMED" },
    select: orderDetailSelect,
  });
};

export const shipOrderServices = async (id, { trackingCode }) => {
  id = Number(id);
  const order = await findOrderOrThrow(id);
  validateTransition(order.status, "SHIPPING");

  return prisma.order.update({
    where: { id },
    data: {
      status: "SHIPPING",
      ...(trackingCode && { trackingCode }),
    },
    select: orderDetailSelect,
  });
};

export const completeOrderServices = async (id) => {
  id = Number(id);
  const order = await findOrderOrThrow(id);
  validateTransition(order.status, "COMPLETED");

  return prisma.order.update({
    where: { id },
    data: { status: "COMPLETED", paymentStatus: "SUCCESS" },
    select: orderDetailSelect,
  });
};

export const cancelOrderServices = async (id, { cancelReason }) => {
  id = Number(id);

  const order = await findOrderOrThrow(id, {
    include: {
      orderItems: { select: { variantId: true, quantity: true } },
    },
  });
  validateTransition(order.status, "CANCELLED");

  await prisma.$transaction(async (tx) => {
    // Hoàn tồn kho
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
          order.paymentStatus === "SUCCESS" ? "REFUNDED" : "FAILED",
      },
    });
  });

  return getOrderByIdServices(id);
};

// ========================
// RETURN FLOW
// ========================

// Admin duyệt yêu cầu hoàn trả
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
  if (!returnRequest) throw new Error("Không tìm thấy yêu cầu hoàn trả");
  if (returnRequest.isApproved !== null)
    throw new Error("Yêu cầu hoàn trả đã được xử lý trước đó");

  await prisma.$transaction(async (tx) => {
    // Cập nhật ReturnRequest
    await tx.returnRequest.update({
      where: { id: returnRequest.id },
      data: {
        isApproved: true,
        refundAmount,
        adminNote: adminNote ?? null,
        resolvedAt: new Date(),
      },
    });

    // Hoàn tồn kho cho các item restockable
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

    // Ghi refundAmount vào Payment (update record hiện có, không tạo mới)
    await tx.payment.update({
      where: { orderId: id },
      data: { refundAmount },
    });

    await tx.order.update({
      where: { id },
      data: { status: "RETURN_APPROVED" },
    });
  });

  return getOrderByIdServices(id);
};

// Admin từ chối yêu cầu hoàn trả → trả về COMPLETED
export const rejectReturnServices = async (id, { adminNote }) => {
  id = Number(id);

  const order = await findOrderOrThrow(id, {
    include: { returnRequest: true },
  });

  validateTransition(order.status, "COMPLETED");

  const returnRequest = order.returnRequest;
  if (!returnRequest) throw new Error("Không tìm thấy yêu cầu hoàn trả");
  if (returnRequest.isApproved !== null)
    throw new Error("Yêu cầu hoàn trả đã được xử lý trước đó");

  await prisma.$transaction(async (tx) => {
    await tx.returnRequest.update({
      where: { id: returnRequest.id },
      data: { isApproved: false, adminNote, resolvedAt: new Date() },
    });

    await tx.order.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
  });

  return getOrderByIdServices(id);
};

// Admin xác nhận đã nhận hàng + hoàn tiền xong
export const completeReturnServices = async (
  id,
  { refundId, refundNote } = {},
) => {
  id = Number(id);
  const order = await findOrderOrThrow(id);
  validateTransition(order.status, "RETURNED");

  await prisma.$transaction(async (tx) => {
    // Đánh dấu Payment đã hoàn tiền
    await tx.payment.update({
      where: { orderId: id },
      data: {
        status: "REFUNDED",
        ...(refundId && { refundId }),
        ...(refundNote && { refundNote }),
      },
    });

    await tx.order.update({
      where: { id },
      data: { status: "RETURNED", paymentStatus: "REFUNDED" },
    });
  });

  return getOrderByIdServices(id);
};
