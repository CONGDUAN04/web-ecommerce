export const adminProductGroupSelect = {
  id: true,
  name: true,
  slug: true,
  thumbnail: true,
  series: true,
  isActive: true,
  createdAt: true,
};

export const adminProductGroupInclude = {
  brand: {
    select: { id: true, name: true, slug: true, logo: true },
  },
  category: {
    select: { id: true, name: true, slug: true },
  },
};

export const adminProductGroupFullInclude = {
  ...adminProductGroupInclude,
  _count: { select: { products: true } },
};
