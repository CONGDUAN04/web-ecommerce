import { comparePassword, hashPassword } from "../../utils/hashPassword.js";
import prisma from "../../config/client.js";
import { ACCOUNT_TYPE } from "../../constants/index.js";
import jwt from "jsonwebtoken";
import {
  createSession,
  findSessionByToken,
  validateSession,
  revokeSession,
} from "../admin/session.js";
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from "../../utils/AppError.js";

export const isEmailExist = async (email) => {
  const count = await prisma.user.count({ where: { username: email } });
  return count > 0;
};

export const registerNewUser = async (data) => {
  const { fullName, username, password } = data;

  const existed = await isEmailExist(username);
  if (existed) throw new ConflictError("Email đã được sử dụng");

  const hashedPassword = await hashPassword(password);

  const userRole = await prisma.role.findUnique({ where: { name: "User" } });
  if (!userRole) throw new NotFoundError("Role 'User'");

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

export const handleLogin = async (username, password, meta = {}) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true },
  });

  if (!user) throw new UnauthorizedError("Email hoặc mật khẩu không đúng");

  if (!user.isActive) {
    throw new UnauthorizedError("Tài khoản đã bị vô hiệu hóa");
  }

  if (user.accountType !== ACCOUNT_TYPE.SYSTEM) {
    throw new UnauthorizedError(
      `Tài khoản này được liên kết qua ${user.accountType}, vui lòng đăng nhập bằng phương thức đó`,
    );
  }

  if (!user.password)
    throw new UnauthorizedError("Email hoặc mật khẩu không đúng");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new UnauthorizedError("Email hoặc mật khẩu không đúng");

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

  const session = await createSession({
    userId: user.id,
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
  });

  return { access_token, refresh_token: session.refreshToken };
};

export const handleRefreshToken = async (token) => {
  if (!token) throw new UnauthorizedError("Không tìm thấy refresh token");

  const session = await findSessionByToken(token);
  validateSession(session);

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

export const handleLogout = async (refreshToken) => {
  if (!refreshToken) return;
  await revokeSession(refreshToken);
};
