import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";

const roleSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  _count: { select: { users: true } },
};

export const getRolesServices = async ({ page = 1, limit = 10 }) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const [items, total] = await Promise.all([
    prisma.role.findMany({
      skip,
      take: l,
      orderBy: { id: "desc" },
      select: roleSelect,
    }),
    prisma.role.count(),
  ]);

  return {
    items,
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  };
};

export const getRoleByIdServices = async (id) => {
  const role = await prisma.role.findUnique({
    where: { id: Number(id) },
    select: roleSelect,
  });

  if (!role) throw new NotFoundError("Vai trò");
  return role;
};

export const createRoleServices = async (data) => {
  const existed = await prisma.role.findUnique({ where: { name: data.name } });
  if (existed) throw new ConflictError("Tên vai trò đã tồn tại");

  return prisma.role.create({
    data: {
      name: data.name,
      description: data.description ?? null,
    },
    select: { id: true, name: true, description: true, createdAt: true },
  });
};

export const updateRoleServices = async (id, data) => {
  id = Number(id);

  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new NotFoundError("Vai trò");

  if (data.name && data.name !== role.name) {
    const duplicated = await prisma.role.findUnique({
      where: { name: data.name },
    });
    if (duplicated) throw new ConflictError("Tên vai trò đã tồn tại");
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError("Cần ít nhất một trường để cập nhật");
  }

  return prisma.role.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, description: true, createdAt: true },
  });
};

export const deleteRoleServices = async (id) => {
  id = Number(id);

  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new NotFoundError("Vai trò");

  const userCount = await prisma.user.count({ where: { roleId: id } });
  if (userCount > 0) {
    throw new ConflictError(
      `Không thể xóa — vai trò đang được dùng bởi ${userCount} người dùng`,
    );
  }

  await prisma.role.delete({ where: { id } });
  return true;
};
