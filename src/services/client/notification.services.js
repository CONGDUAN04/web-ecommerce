import prisma from "../../config/client.js";

// Lấy danh sách notification (có pagination)
export const getNotificationsService = async (
  userId,
  { page = 1, limit = 10 } = {},
) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return {
    data: notifications,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

// Đánh dấu đã đọc — dùng updateMany nhưng kiểm tra count để biết có tồn tại không
export const markAsReadService = async (id, userId) => {
  const result = await prisma.notification.updateMany({
    where: { id: Number(id), userId },
    data: { isRead: true },
  });

  if (result.count === 0) return null; // không tìm thấy hoặc không thuộc user

  // Trả lại object notification sau khi update
  return prisma.notification.findUnique({ where: { id: Number(id) } });
};

// Xóa notification
export const deleteNotificationService = async (id, userId) => {
  const result = await prisma.notification.deleteMany({
    where: { id: Number(id), userId },
  });

  return result.count > 0; // true nếu xóa được, false nếu không tìm thấy
};
