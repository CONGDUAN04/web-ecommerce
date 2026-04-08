import prisma from "../../config/client.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { parsePagination } from "../../utils/pagination.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";
import { adminUserSelect } from "../../select/user.select.js";

export const getUsersServices = async ({ page = 1, limit = 10 }) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: l,
      orderBy: { id: "desc" },
      select: adminUserSelect,
    }),
    prisma.user.count(),
  ]);

  return {
    items,
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  };
};

export const getUserByIdServices = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: adminUserSelect,
  });

  if (!user) throw new NotFoundError("Người dùng");
  return user;
};

export const createUserServices = async (data, avatar) => {
  const existUsername = await prisma.user.findUnique({
    where: { username: data.username },
  });
  if (existUsername) throw new ConflictError("Username đã tồn tại");

  if (data.phone) {
    const existPhone = await prisma.user.findFirst({
      where: { phone: data.phone },
    });
    if (existPhone) throw new ConflictError("Số điện thoại đã tồn tại");
  }

  const role = await prisma.role.findUnique({
    where: { id: Number(data.roleId) },
  });
  if (!role) throw new NotFoundError("Role");

  const hashedPassword = await hashPassword("123456");

  return prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
      fullName: data.fullName,
      phone: data.phone ?? null,
      avatar: avatar ?? null,
      accountType: "SYSTEM",
      roleId: Number(data.roleId),
    },
    select: adminUserSelect,
  });
};

export const updateUserServices = async (id, data, avatar) => {
  const userId = Number(id);

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) throw new NotFoundError("Người dùng");

  if (data.phone) {
    const existPhone = await prisma.user.findFirst({
      where: { phone: data.phone, NOT: { id: userId } },
    });
    if (existPhone) throw new ConflictError("Số điện thoại đã tồn tại");
  }

  if (data.roleId) {
    const role = await prisma.role.findUnique({
      where: { id: Number(data.roleId) },
    });
    if (!role) throw new NotFoundError("Role");
  }

  const updateData = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.phone !== undefined) updateData.phone = data.phone || null;
  if (data.roleId !== undefined)
    updateData.roleId = data.roleId ? Number(data.roleId) : null;
  if (avatar) updateData.avatar = avatar;

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError("Cần ít nhất một trường để cập nhật");
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: adminUserSelect,
  });
};

export const deleteUserServices = async (id) => {
  id = Number(id);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Người dùng");

  const orderCount = await prisma.order.count({ where: { userId: id } });
  if (orderCount > 0) {
    throw new ConflictError(
      `Không thể xóa — người dùng đang có ${orderCount} đơn hàng`,
    );
  }

  await prisma.user.delete({ where: { id } });
  return true;
};
