import prisma from "../../config/client.js";
import { adminRoleSelect } from "../../select/role.select.js";
import { getAll, getById } from "../../services/common/base.services.js";

import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";

export const getRolesServices = (query) => {
  return getAll(prisma.role, query, {
    orderBy: { id: "desc" },
    select: adminRoleSelect,
  });
};

export const getRoleByIdServices = (id) => {
  return getById(prisma.role, id, { select: adminRoleSelect }, "vai trò");
};

export const createRoleServices = async (data) => {
  const existed = await prisma.role.findUnique({
    where: { name: data.name },
  });

  if (existed) throw new ConflictError("Tên vai trò đã tồn tại");

  return prisma.role.create({
    data: {
      name: data.name,
      description: data.description ?? null,
    },
    select: adminRoleSelect,
  });
};

export const updateRoleServices = async (id, data) => {
  id = Number(id);

  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new NotFoundError("Vai trò");

  if (data.name && data.name !== role.name) {
    const existed = await prisma.role.findUnique({
      where: { name: data.name },
    });
    if (existed) throw new ConflictError("Tên vai trò đã tồn tại");
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
    select: adminRoleSelect,
  });
};

export const deleteRoleServices = async (id) => {
  id = Number(id);

  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new NotFoundError("Vai trò");

  const userCount = await prisma.user.count({
    where: { roleId: id },
  });

  if (userCount > 0) {
    throw new ConflictError(
      `Không thể xóa — vai trò đang được dùng bởi người dùng`,
    );
  }

  await prisma.role.delete({ where: { id } });
  return true;
};
