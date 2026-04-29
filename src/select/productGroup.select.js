export const adminProductGroupSelect = {
  id: true,
  name: true,
  slug: true,
  series: true,
  description: true,
  thumbnail: true,
  isActive: true,
  createdAt: true,
  brandId: true,
  categoryId: true,
};

export const adminProductGroupInclude = {
  brand: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
};

export const adminProductGroupFullInclude = {
  ...adminProductGroupInclude,
  _count: {
    select: {
      products: true,
    },
  },
};
