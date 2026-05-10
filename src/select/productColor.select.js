export const adminProductColorTableSelect = {
  id: true,

  image: true,

  color: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },

  product: {
    select: {
      id: true,
      name: true,
    },
  },

  _count: {
    select: {
      variants: true,
    },
  },
};
export const adminProductColorDetailSelect = {
  id: true,

  image: true,

  imageId: true,

  createdAt: true,

  updatedAt: true,

  color: {
    select: {
      id: true,

      name: true,

      code: true,
    },
  },

  product: {
    select: {
      id: true,

      name: true,

      slug: true,

      thumbnail: true,
    },
  },

  variants: {
    select: {
      id: true,

      sku: true,

      storage: true,

      price: true,

      comparePrice: true,

      quantity: true,

      sold: true,

      isActive: true,

      createdAt: true,
    },

    orderBy: {
      storage: "asc",
    },
  },

  _count: {
    select: {
      variants: true,
    },
  },
};
