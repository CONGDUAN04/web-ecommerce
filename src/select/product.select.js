export const clientProductSelect = {
  id: true,
  name: true,
  slug: true,
  thumbnail: true,

  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true, logo: true } },

  variants: {
    where: { isActive: true },
    select: {
      id: true,
      price: true,
      comparePrice: true,

      flashSaleItems: {
        where: {
          flashSale: { isActive: true },
        },
        select: {
          salePrice: true,
          flashSale: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  },
};

//ADMIN
export const adminProductSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,

  thumbnail: true,
  thumbnailId: true,

  isActive: true,
  viewCount: true,

  createdAt: true,
  updatedAt: true,

  brand: {
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
    },
  },

  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  group: {
    select: {
      id: true,
      name: true,
      slug: true,
      series: true,
    },
  },

  _count: {
    select: {
      variants: true,
    },
  },
};

export const homeProductSelect = {
  id: true,
  name: true,
  slug: true,
  thumbnail: true,
  createdAt: true,

  brand: {
    select: { id: true, name: true, slug: true, logo: true },
  },

  category: {
    select: { id: true, name: true, slug: true },
  },

  // ✅ Lấy variant rẻ nhất, có orderBy price asc
  variants: {
    where: { isActive: true },
    orderBy: { price: "asc" }, // ✅ thêm dòng này
    take: 1,
    select: {
      price: true,
      comparePrice: true,
      storage: true,
      flashSaleItems: {
        where: {
          flashSale: {
            isActive: true,
            startTime: { lte: new Date() }, // ✅ đã bắt đầu
            endTime: { gte: new Date() }, // ✅ chưa kết thúc
          },
        },
        take: 1,
        select: {
          salePrice: true,
          flashSale: {
            select: { startTime: true, endTime: true },
          },
        },
      },
    },
  },

  reviews: {
    select: { rating: true },
  },

  _count: {
    select: { reviews: true },
  },
};
