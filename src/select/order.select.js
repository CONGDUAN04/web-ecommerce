//Client
export const clientOrderSelect = {
  id: true,
  subtotal: true,
  discountAmount: true,
  shippingFee: true,
  finalPrice: true,

  receiverName: true,
  receiverPhone: true,
  receiverAddress: true,

  status: true,
  paymentMethod: true,
  paymentStatus: true,

  createdAt: true,

  orderItems: {
    select: {
      productName: true,
      thumbnail: true,
      variantColor: true,
      variantStorage: true,
      variantSku: true,
      quantity: true,
      price: true,
    },
  },
};
//Admin
export const adminOrderListSelect = {
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
  user: { select: { id: true, username: true, fullName: true } },
  voucher: { select: { id: true, code: true } },
  _count: { select: { orderItems: true } },
};
export const adminOrderDetailSelect = {
  ...adminOrderListSelect,
  receiverAddress: true,
  note: true,
  cancelReason: true,
  updatedAt: true,
  userId: true,
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
      variant: { select: { id: true, sku: true, color: true } },
    },
  },
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
