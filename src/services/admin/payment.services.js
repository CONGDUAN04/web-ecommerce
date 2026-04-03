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
    // FIX #3: thêm mode insensitive để tương thích PostgreSQL
    ...(keyword && {
      OR: [
        { transactionId: { contains: keyword, mode: "insensitive" } },
        { refundId: { contains: keyword, mode: "insensitive" } },
        {
          order: {
            receiverPhone: { contains: keyword, mode: "insensitive" },
          },
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
export const confirmBankingServices = async (id, { transactionId }) => {
  const payment = await prisma.payment.findUnique({
    where: { id: Number(id) },
    include: {
      order: { select: { id: true, userId: true } },
    },
  });

  if (!payment) throw new Error("Giao dịch không tồn tại");

  if (payment.provider !== "BANKING")
    throw new Error("Chỉ xác nhận được giao dịch BANKING");

  // FIX #2: xử lý đủ các trạng thái không hợp lệ
  if (["SUCCESS", "REFUNDED"].includes(payment.status))
    throw new Error("Giao dịch đã được xử lý trước đó");
  if (payment.status === "FAILED")
    throw new Error("Giao dịch đã thất bại, không thể xác nhận");

  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: Number(id) },
      data: {
        status: "SUCCESS",
        // FIX #1: bỏ note khỏi refundNote, chỉ lưu transactionId (required)
        transactionId,
      },
      select: paymentListSelect,
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: "SUCCESS" },
    });

    // FIX #5: notification cho user
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
