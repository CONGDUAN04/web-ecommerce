export const adminBrandSelect = {
  id: true,
  name: true,
  slug: true,
  logo: true,
  createdAt: true,
  _count: {
    select: { products: true },
  },
};
