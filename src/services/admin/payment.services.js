import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";

const paymentListSelect = {
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
  order: {
    select: {
      id: true,
      finalPrice: true,
      status: true,
      receiverName: true,
      receiverPhone: true,
      user: { select: { id: true, username: true, fullName: true } },
    },
  },
};

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
        { transactionId: { contains: keyword } },
        { refundId: { contains: keyword } },
        { order: { receiverPhone: { contains: keyword } } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      select: paymentListSelect,
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
    select: paymentListSelect,
  });
  if (!payment) throw new Error("Giao dịch không tồn tại");
  return payment;
};

// Xác nhận thanh toán BANKING thủ công
export const confirmBankingServices = async (id, { transactionId, note }) => {
  const payment = await prisma.payment.findUnique({
    where: { id: Number(id) },
  });
  if (!payment) throw new Error("Giao dịch không tồn tại");
  if (payment.provider !== "BANKING")
    throw new Error("Chỉ xác nhận được giao dịch BANKING");
  if (payment.status === "SUCCESS")
    throw new Error("Giao dịch đã được xác nhận trước đó");

  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: Number(id) },
      data: {
        status: "SUCCESS",
        transactionId: transactionId ?? null,
        refundNote: note ?? null,
      },
      select: paymentListSelect,
    });

    // Cập nhật paymentStatus trên Order
    await tx.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: "SUCCESS" },
    });

    return updated;
  });
};
