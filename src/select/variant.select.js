export const adminVariantInclude = {
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      groupId: true,
      brandId: true,
      categoryId: true,
      group: {
        select: { id: true, name: true, series: true },
      },
    },
  },
};
