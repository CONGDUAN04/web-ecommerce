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
    prisma.product.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.variant.count({ where: { quantity: { lte: 5 } } }),
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
  const now = new Date();

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
    today: today,
    thisWeek: week,
    thisMonth: month,
    thisYear: year,
  };
};

const sumRevenue = async (date) => {
  const result = await prisma.order.aggregate({
    _sum: { finalPrice: true },
    where: {
      status: "COMPLETED",
      createdAt: { gte: date },
    },
  });

  return result._sum.finalPrice || 0;
};

export const getOrderStatusServices = async () => {
  const result = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  const data = {};
  result.forEach((i) => {
    data[i.status] = i._count;
  });

  return data;
};

export const getTopProductsServices = async (limit = 10) => {
  return prisma.orderItem.groupBy({
    by: ["productName"],
    _sum: { quantity: true },
    orderBy: {
      _sum: { quantity: "desc" },
    },
    take: Number(limit),
  });
};

export const getLowStockServices = async (threshold = 5) => {
  return prisma.variant.findMany({
    where: {
      quantity: { lte: Number(threshold) },
    },
    include: {
      product: true,
    },
  });
};

export const getRecentOrdersServices = async (limit = 5) => {
  return prisma.order.findMany({
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });
};
