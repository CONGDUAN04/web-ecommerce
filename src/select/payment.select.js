export const adminPaymentSelect = {
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
