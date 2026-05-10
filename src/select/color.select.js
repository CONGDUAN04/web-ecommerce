export const adminColorTableSelect = {
  id: true,

  name: true,

  code: true,
};

export const adminColorDetailSelect = {
  id: true,

  name: true,

  code: true,

  createdAt: true,

  updatedAt: true,

  _count: {
    select: {
      productColors: true,
    },
  },
};
