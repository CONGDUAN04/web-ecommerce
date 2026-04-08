import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";
import { adminPaymentSelect } from "../../select/payment.select.js";
export const getPaymentsServices = async ({
  page = 1,
  limit = 10,
  status,
  provider,
  from,
  to,
  keyword,
}) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const where = {
    ...(status && { status }),
    ...(provider && { provider }),
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
        { transactionId: { contains: keyword, mode: "insensitive" } },
        { refundId: { contains: keyword, mode: "insensitive" } },
        {
          order: { receiverPhone: { contains: keyword, mode: "insensitive" } },
        },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      select: adminPaymentSelect,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    items,
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  };
};

export const getPaymentByIdServices = async (id) => {
  const payment = await prisma.payment.findUnique({
    where: { id: Number(id) },
    select: adminPaymentSelect,
  });

  if (!payment) throw new NotFoundError("Giao dịch");
  return payment;
};

export const confirmBankingServices = async (id, { transactionId }) => {
  const payment = await prisma.payment.findUnique({
    where: { id: Number(id) },
    include: { order: { select: { id: true, userId: true } } },
  });

  if (!payment) throw new NotFoundError("Giao dịch");

  if (payment.provider !== "BANKING")
    throw new ValidationError("Chỉ xác nhận được giao dịch BANKING");

  if (["SUCCESS", "REFUNDED"].includes(payment.status))
    throw new ConflictError("Giao dịch đã được xử lý trước đó");

  if (payment.status === "FAILED")
    throw new ConflictError("Giao dịch đã thất bại, không thể xác nhận");

  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: Number(id) },
      data: { status: "SUCCESS", transactionId },
      select: adminPaymentSelect,
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: "SUCCESS" },
    });

    await tx.notification.create({
      data: {
        userId: payment.order.userId,
        type: "ORDER",
        title: "Thanh toán thành công",
        content: `Thanh toán đơn hàng #${payment.orderId} đã được xác nhận. Mã giao dịch: ${transactionId}.`,
        link: `/orders/${payment.orderId}`,
      },
    });

    return updated;
  });
};
