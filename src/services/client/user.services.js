import prisma from "../../config/client.js";
import { comparePassword, hashPassword } from "../../utils/hashPassword.js";
import { ACCOUNT_TYPE } from "../../config/constant.js";

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      fullName: true,
      phone: true,
      avatar: true,
      accountType: true,
      role: { select: { id: true, name: true } },
      createdAt: true,
    },
  });

  if (!user) throw new Error("Người dùng không tồn tại");

  return user;
};

export const updateUserProfile = async (userId, data) => {
  const { fullName, phone, avatar } = data;

  if (phone) {
    const existing = await prisma.user.findFirst({
      where: { phone, id: { not: userId } },
    });
    if (existing) throw new Error("Số điện thoại đã được sử dụng");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Người dùng không tồn tại");

  return prisma.user.update({
    where: { id: userId },
    data: {
      fullName: fullName ?? user.fullName,
      phone: phone ?? user.phone,
      avatar: avatar ?? user.avatar,
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      phone: true,
      avatar: true,
    },
  });
};

export const changeUserPassword = async (userId, data) => {
  const { oldPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Người dùng không tồn tại");

  if (user.accountType !== ACCOUNT_TYPE.SYSTEM) {
    throw new Error("Tài khoản OAuth không thể đổi mật khẩu");
  }

  if (!user.password) throw new Error("Tài khoản không có mật khẩu");

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) throw new Error("Mật khẩu cũ không đúng");

  if (oldPassword === newPassword) {
    throw new Error("Mật khẩu mới không được trùng mật khẩu cũ");
  }

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
};
