import prisma from "../../config/client.js";

export const getDashboardOverviewServices = async () => {
  const [
    revenue,
    totalOrders,
    totalUsers,
    totalProducts,
    pendingOrders,
    lowStock,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { finalPrice: true },
      where: { status: "COMPLETED" },
    }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.variant.count({
      where: { quantity: { lte: 5 }, isActive: true },
    }),
  ]);

  return {
    totalRevenue: revenue._sum.finalPrice || 0,
    totalOrders,
    totalUsers,
    totalProducts,
    pendingOrders,
    lowStockProducts: lowStock,
  };
};

export const getRevenueSummaryServices = async () => {
  // FIX #4: bỏ `now` không dùng
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);

  const startWeek = new Date();
  startWeek.setDate(startWeek.getDate() - 7);

  const startMonth = new Date();
  startMonth.setMonth(startMonth.getMonth() - 1);

  const startYear = new Date();
  startYear.setFullYear(startYear.getFullYear() - 1);

  const [today, week, month, year] = await Promise.all([
    sumRevenue(startToday),
    sumRevenue(startWeek),
    sumRevenue(startMonth),
    sumRevenue(startYear),
  ]);

  return {
    today,
    thisWeek: week,
    thisMonth: month,
    thisYear: year,
  };
};

const sumRevenue = async (from) => {
  const result = await prisma.order.aggregate({
    _sum: { finalPrice: true },
    where: {
      status: "COMPLETED",
      createdAt: { gte: from },
    },
  });
  return result._sum.finalPrice || 0;
};

export const getOrderStatusServices = async () => {
  const result = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  // FIX #1: _count là object { _all: N }, không phải number trực tiếp
  const data = {};
  result.forEach((i) => {
    data[i.status] = i._count._all;
  });

  return data;
};

export const getTopProductsServices = async (limit = 10) => {
  // FIX #3: lọc bỏ đơn CANCELLED, PENDING
  // FIX #8: group theo variantId thay vì productName (tránh bị tách khi đổi tên)
  const grouped = await prisma.orderItem.groupBy({
    by: ["variantId"],
    _sum: { quantity: true },
    where: {
      order: {
        status: { in: ["COMPLETED", "SHIPPING", "CONFIRMED"] },
      },
    },
    orderBy: {
      _sum: { quantity: "desc" },
    },
    take: limit,
  });

  // Lấy thông tin variant + product kèm theo
  const variantIds = grouped.map((g) => g.variantId);
  const variants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    select: {
      id: true,
      sku: true,
      color: true,
      price: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
        },
      },
    },
  });

  const variantMap = Object.fromEntries(variants.map((v) => [v.id, v]));

  return grouped.map((g) => ({
    variant: variantMap[g.variantId] ?? null,
    totalSold: g._sum.quantity || 0,
  }));
};

export const getLowStockServices = async (threshold = 5) => {
  // FIX #6: lọc isActive: true, bỏ variant đã ẩn
  // FIX #5: dùng select thay vì include để tránh kéo description dài
  return prisma.variant.findMany({
    where: {
      quantity: { lte: threshold },
      isActive: true,
    },
    select: {
      id: true,
      sku: true,
      color: true,
      quantity: true,
      price: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
          isActive: true,
          category: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { quantity: "asc" },
  });
};

export const getRecentOrdersServices = async (limit = 5) => {
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      finalPrice: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      receiverName: true,
      receiverPhone: true,
      createdAt: true,
      // FIX #2: select thay vì include, không lộ password
      user: {
        select: { id: true, username: true, fullName: true, phone: true },
      },
      _count: { select: { orderItems: true } },
    },
  });
};
