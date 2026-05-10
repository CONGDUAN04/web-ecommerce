export const adminVariantTableSelect = {
  id: true,

  sku: true,

  storage: true,

  price: true,

  comparePrice: true,

  quantity: true,

  isActive: true,

  productColor: {
    select: {
      id: true,

      color: {
        select: {
          name: true,
          code: true,
        },
      },
    },
  },

  product: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const adminVariantDetailSelect = {
  id: true,

  sku: true,

  storage: true,

  price: true,

  comparePrice: true,

  quantity: true,

  sold: true,

  isActive: true,

  createdAt: true,

  updatedAt: true,

  productColor: {
    select: {
      id: true,

      image: true,

      imageId: true,

      color: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  },

  product: {
    select: {
      id: true,
      name: true,

      group: {
        select: {
          id: true,
          name: true,
          series: true,
        },
      },

      brand: {
        select: {
          id: true,
          name: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};
