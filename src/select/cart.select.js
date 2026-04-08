export const clientCartSelect = {
  id: true,
  quantity: true,
  price: true,
  createdAt: true,
  variant: {
    select: {
      id: true,
      sku: true,
      color: true,
      price: true,
      comparePrice: true,
      quantity: true,
      isActive: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
          storage: true,
        },
      },
    },
  },
};
