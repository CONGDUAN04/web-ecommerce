export const adminCategorySelect = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
  _count: {
    select: { products: true },
  },
};
