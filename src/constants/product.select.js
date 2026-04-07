export const productSelect = {
  id: true,
  name: true,
  slug: true,
  storage: true,
  thumbnail: true,
  viewCount: true,

  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true, logo: true } },
  group: { select: { id: true, name: true, slug: true, series: true } },

  variants: {
    where: { isActive: true },
    select: {
      id: true,
      sku: true,
      color: true,
      price: true,
      comparePrice: true,
      quantity: true,
      sold: true,

      flashSaleItems: {
        where: {
          flashSale: {
            isActive: true,
          },
        },
        select: {
          salePrice: true,
          quantity: true,
          sold: true,
          flashSale: {
            select: {
              startTime: true,
              endTime: true,
              isActive: true,
            },
          },
        },
      },
    },
  },
};
