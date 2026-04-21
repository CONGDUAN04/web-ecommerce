export const adminCategorySelect = {
  id: true,
  name: true,
  slug: true,
  icon: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: { products: true },
  },
};
