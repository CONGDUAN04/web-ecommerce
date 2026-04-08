import prisma from "../../config/client.js";
import crypto from "crypto";
import { NotFoundError, ValidationError } from "../../utils/AppError.js";

const REFRESH_TOKEN_EXPIRES_DAYS =
  Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7;

export const createSession = async ({ userId, userAgent, ipAddress }) => {
  if (!userId) throw new ValidationError("userId là bắt buộc");

  const refreshToken = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  return prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent: userAgent ?? null,
      ipAddress: ipAddress ?? null,
      expiresAt,
    },
  });
};

export const findSessionByToken = async (token) => {
  if (!token) throw new ValidationError("Token là bắt buộc");

  return prisma.session.findUnique({
    where: { refreshToken: token },
    include: {
      user: { include: { role: true } },
    },
  });
};

export const validateSession = (session) => {
  if (!session) throw new NotFoundError("Session không tồn tại");
  if (session.isRevoked) throw new ValidationError("Session đã bị thu hồi");
  if (new Date() > session.expiresAt)
    throw new ValidationError("Session đã hết hạn");

  return true;
};

export const revokeSession = async (refreshToken) => {
  if (!refreshToken) throw new ValidationError("Token là bắt buộc");

  const session = await prisma.session.findUnique({
    where: { refreshToken },
  });
  if (!session) return null;

  return prisma.session.update({
    where: { refreshToken },
    data: { isRevoked: true },
  });
};

export const revokeAllUserSessions = async (userId) => {
  if (!userId) throw new ValidationError("userId là bắt buộc");

  return prisma.session.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true },
  });
};

export const getActiveSessions = async (userId) => {
  if (!userId) throw new ValidationError("userId là bắt buộc");

  return prisma.session.findMany({
    where: {
      userId,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteExpiredSessions = async () => {
  const result = await prisma.session.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { isRevoked: true }],
    },
  });

  return result.count;
};
