import prisma from "../../config/client.js";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from "../../utils/AppError.js";

export const createReturnRequestService = async (userId, orderId, body) => {
  const { reason, note, evidence, items } = body;

  const order = await prisma.order.findFirst({
    where: { id: Number(orderId), userId },
    include: { orderItems: true, returnRequest: true },
  });

  if (!order) throw new NotFoundError("Đơn hàng");

  if (order.status !== "COMPLETED") {
    throw new ValidationError(
      "Chỉ có thể yêu cầu hoàn hàng với đơn hàng đã hoàn thành",
    );
  }

  if (order.returnRequest) {
    throw new ConflictError("Đơn hàng này đã có yêu cầu hoàn hàng trước đó");
  }

  for (const item of items) {
    const orderItem = order.orderItems.find((o) => o.id === item.orderItemId);
    if (!orderItem) {
      throw new NotFoundError(
        `OrderItem #${item.orderItemId} không thuộc đơn hàng này`,
      );
    }
    if (item.quantity > orderItem.quantity) {
      throw new ValidationError(
        `Số lượng hoàn trả của sản phẩm #${item.orderItemId} vượt quá số lượng đã mua`,
      );
    }
  }

  return prisma.$transaction(async (tx) => {
    const created = await tx.returnRequest.create({
      data: {
        orderId: Number(orderId),
        userId,
        reason,
        note: note ?? null,
        evidence: evidence ? JSON.stringify(evidence) : null,
        returnItems: {
          create: items.map((item) => ({
            orderItemId: item.orderItemId,
            quantity: item.quantity,
            reason: item.reason ?? null,
            isRestockable: true,
          })),
        },
      },
      include: {
        returnItems: {
          include: {
            orderItem: {
              select: {
                productName: true,
                variantColor: true,
                variantStorage: true,
                variantSku: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    });

    await tx.order.update({
      where: { id: Number(orderId) },
      data: { status: "RETURN_REQUESTED" },
    });

    await tx.notification.create({
      data: {
        userId,
        type: "RETURN",
        title: "Yêu cầu hoàn hàng đã được gửi",
        content: `Yêu cầu hoàn hàng đơn #${orderId} đang chờ admin xét duyệt.`,
        link: `/orders/${orderId}`,
      },
    });

    return created;
  });
};

export const getReturnRequestService = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: Number(orderId), userId },
  });
  if (!order) throw new NotFoundError("Đơn hàng");

  const returnRequest = await prisma.returnRequest.findUnique({
    where: { orderId: Number(orderId) },
    include: {
      returnItems: {
        include: {
          orderItem: {
            select: {
              productName: true,
              variantColor: true,
              variantStorage: true,
              variantSku: true,
              thumbnail: true,
            },
          },
        },
      },
    },
  });

  if (!returnRequest) throw new NotFoundError("Yêu cầu hoàn hàng");
  return returnRequest;
};
