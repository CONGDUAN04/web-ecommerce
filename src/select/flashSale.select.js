export const adminFlashSaleSelect = {
  id: true,
  name: true,
  startTime: true,
  endTime: true,
  isActive: true,
  createdAt: true,
  _count: { select: { items: true } },
};

export const adminFlashSaleDetailSelect = {
  ...adminFlashSaleSelect,
  items: {
    select: {
      id: true,
      salePrice: true,
      quantity: true,
      sold: true,
      variant: {
        select: {
          id: true,
          sku: true,
          color: true,
          price: true,
          product: { select: { id: true, name: true, thumbnail: true } },
        },
      },
    },
  },
};
