export const adminBrandSelect = {
  id: true,
  name: true,
  slug: true,
  logo: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: { products: true },
  },
};
