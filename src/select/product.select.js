//CLIENT
export const clientProductSelect = {
  id: true,
  name: true,
  slug: true,
  thumbnail: true,

  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true, logo: true } },

  variants: {
    where: { isActive: true },
    select: {
      id: true,
      price: true,
      comparePrice: true,
      color: true,

      flashSaleItems: {
        where: {
          flashSale: { isActive: true },
        },
        select: {
          salePrice: true,
          flashSale: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  },
};
//ADMIN
export const adminProductInclude = {
  brand: { select: { id: true, name: true, slug: true, logo: true } },
  category: { select: { id: true, name: true, slug: true } },
  group: { select: { id: true, name: true, slug: true, series: true } },
};
