import prisma from "../../config/client.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { adminUserSelect } from "../../select/user.select.js";
import { getAll, getById } from "../../services/common/base.services.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";
import { deleteWithFile } from "../common/base.services.js";
import { cleanupOldFile } from "../common/file.helper.js";
import { ROLE } from "../../constants/index.js";

export const getUsersServices = (query) => {
  return getAll(prisma.user, query, {
    orderBy: { id: "desc" },
    select: adminUserSelect,
  });
};

export const getUserByIdServices = (id) => {
  return getById(prisma.user, id, { select: adminUserSelect }, "người dùng");
};

export const createUserServices = async (data, currentUser) => {
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

  if (role.name === ROLE.ADMIN || role.name === ROLE.SUPER_ADMIN) {
    if (currentUser.role !== ROLE.SUPER_ADMIN) {
      throw new ConflictError("Không có quyền tạo Admin hoặc Super Admin");
    }
  }

  const hashedPassword = await hashPassword("123456");

  return prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
      fullName: data.fullName,
      phone: data.phone ?? null,
      avatar: data.avatar || null,
      avatarId: data.avatarId || null,
      accountType: "SYSTEM",
      roleId: Number(data.roleId),
    },
    select: adminUserSelect,
  });
};

export const updateUserServices = async (id, data, currentUser) => {
  id = Number(id);

  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!user) throw new NotFoundError("Người dùng");

  if (
    user.role?.name === ROLE.SUPER_ADMIN &&
    currentUser.role !== ROLE.SUPER_ADMIN
  ) {
    throw new ConflictError(
      "Không có quyền chỉnh sửa thông tin của Super Admin",
    );
  }

  const isSelf = currentUser.id === id;

  if (isSelf && data.roleId !== undefined) {
    throw new ConflictError("Không thể tự thay đổi role của chính mình");
  }

  if (data.roleId !== undefined) {
    const role = await prisma.role.findUnique({
      where: { id: Number(data.roleId) },
    });

    if (!role) throw new NotFoundError("Role");

    if (role.name === ROLE.ADMIN || role.name === ROLE.SUPER_ADMIN) {
      if (currentUser.role !== ROLE.SUPER_ADMIN) {
        throw new ConflictError(
          "Không có quyền thay đổi role thành Admin hoặc Super Admin",
        );
      }
    }

    if (
      user.role?.name === ROLE.ADMIN ||
      user.role?.name === ROLE.SUPER_ADMIN
    ) {
      if (currentUser.role !== ROLE.SUPER_ADMIN) {
        throw new ConflictError(
          "Không có quyền thay đổi role của Admin hoặc Super Admin",
        );
      }
    }
  }

  if (data.phone && data.phone !== user.phone) {
    const existed = await prisma.user.findFirst({
      where: { phone: data.phone },
    });

    if (existed) throw new ConflictError("Số điện thoại đã tồn tại");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      fullName: data.fullName ?? user.fullName,
      phone: data.phone ?? user.phone,
      roleId: data.roleId !== undefined ? Number(data.roleId) : user.roleId,
      avatar: data.avatar ?? user.avatar,
      avatarId: data.avatarId ?? user.avatarId,
    },
    select: adminUserSelect,
  });

  cleanupOldFile(user.avatarId, data.avatarId, { role: "ADMIN" }, "avatar");

  return updated;
};

export const deleteUserServices = async (id, currentUser) => {
  id = Number(id);

  if (currentUser.id === id) {
    throw new ConflictError("Không thể xoá chính tài khoản của bạn");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!user) throw new NotFoundError("Người dùng");

  if (user.role?.name === ROLE.ADMIN || user.role?.name === ROLE.SUPER_ADMIN) {
    if (currentUser.role !== ROLE.SUPER_ADMIN) {
      throw new ConflictError("Không có quyền xóa Admin hoặc Super Admin");
    }
  }

  const userCount = await prisma.order.count({
    where: { userId: id },
  });

  if (userCount > 0) {
    throw new ConflictError("Không thể xóa — người dùng đang có đơn hàng");
  }

  return deleteWithFile(
    prisma.user,
    id,
    "avatarId",
    { role: "ADMIN" },
    "người dùng",
  );
};

export const updateUserStatusServices = async (id, data, currentUser) => {
  id = Number(id);

  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!user) throw new NotFoundError("Người dùng");

  if (currentUser.id === id) {
    throw new ConflictError("Không thể tự vô hiệu hóa chính mình");
  }

  if (user.role?.name === ROLE.SUPER_ADMIN) {
    throw new ConflictError("Không thể vô hiệu hóa Super Admin");
  }

  if (currentUser.role === ROLE.ADMIN && user.role?.name === ROLE.ADMIN) {
    throw new ConflictError("Admin không thể vô hiệu hóa Admin khác");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      isActive: data.isActive,
    },
    select: adminUserSelect,
  });

  return updated;
};
