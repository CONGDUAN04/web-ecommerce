import { comparePassword, hashPassword } from "../../utils/hashPassword.js";
import prisma from "../../config/client.js";
import { ACCOUNT_TYPE } from "../../config/constant.js";
import jwt from "jsonwebtoken";
import {
  createSession,
  findSessionByToken,
  validateSession,
  revokeSession,
} from "../admin/session.js";

// Kiểm tra email đã tồn tại chưa
export const isEmailExist = async (email) => {
  const count = await prisma.user.count({
    where: { username: email },
  });
  return count > 0;
};

// Đăng ký tài khoản mới
export const registerNewUser = async (data) => {
  const { fullName, username, password } = data;

  const existed = await isEmailExist(username);
  if (existed) throw new Error("Email đã được sử dụng");

  const hashedPassword = await hashPassword(password);

  const userRole = await prisma.role.findUnique({
    where: { name: "User" },
  });

  if (!userRole) throw new Error("Role 'User' không tồn tại trong hệ thống");

  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      fullName,
      accountType: ACCOUNT_TYPE.SYSTEM,
      roleId: userRole.id,
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      createdAt: true,
    },
  });
};

// Đăng nhập — trả về access_token + refresh_token (qua session)
export const handleLogin = async (username, password, meta = {}) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true },
  });

  if (!user) throw new Error("Email hoặc mật khẩu không đúng");

  // Chặn tài khoản OAuth đăng nhập bằng password
  if (user.accountType !== ACCOUNT_TYPE.SYSTEM) {
    throw new Error(
      `Tài khoản này được liên kết qua ${user.accountType}, vui lòng đăng nhập bằng phương thức đó`,
    );
  }

  if (!user.password) throw new Error("Email hoặc mật khẩu không đúng");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Email hoặc mật khẩu không đúng");

  // Tạo access token (ngắn hạn)
  const payload = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role?.name, // string: "Admin" | "User"
    accountType: user.accountType,
  };

  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // nên đặt "15m"
  });

  // Tạo session + refresh token (dài hạn, lưu DB)
  const session = await createSession({
    userId: user.id,
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
  });

  return {
    access_token,
    refresh_token: session.refreshToken,
  };
};

// Làm mới access token bằng refresh token
export const handleRefreshToken = async (token) => {
  if (!token) throw new Error("Không tìm thấy refresh token");

  const session = await findSessionByToken(token);

  validateSession(session); // throw nếu không hợp lệ

  const { user } = session;

  const payload = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role?.name,
    accountType: user.accountType,
  };

  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return { access_token };
};

// Đăng xuất — thu hồi session
export const handleLogout = async (refreshToken) => {
  if (!refreshToken) return;
  await revokeSession(refreshToken);
};

// Lấy thông tin user theo ID
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
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) throw new Error("Người dùng không tồn tại");

  return user;
};

// Cập nhật thông tin cá nhân
export const updateUserProfile = async (userId, data) => {
  const { fullName, phone, avatar } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

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

// Đổi mật khẩu
export const changeUserPassword = async (userId, data) => {
  const { oldPassword, newPassword } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("Người dùng không tồn tại");

  // Chặn tài khoản OAuth đổi password
  if (user.accountType !== ACCOUNT_TYPE.SYSTEM) {
    throw new Error("Tài khoản OAuth không thể đổi mật khẩu");
  }

  if (!user.password) throw new Error("Tài khoản không có mật khẩu");

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) throw new Error("Mật khẩu cũ không đúng");

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return true;
};
