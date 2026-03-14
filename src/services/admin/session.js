import prisma from "../../config/client.js";
import crypto from "crypto";

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

// Tạo session mới khi login
export const createSession = async ({ userId, userAgent, ipAddress }) => {
    const refreshToken = crypto.randomBytes(64).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    const session = await prisma.session.create({
        data: {
            userId,
            refreshToken,
            userAgent: userAgent ?? null,
            ipAddress: ipAddress ?? null,
            expiresAt,
        },
    });

    return session;
};

// Tìm session theo refresh token (kèm thông tin user)
export const findSessionByToken = async (token) => {
    const session = await prisma.session.findUnique({
        where: { refreshToken: token },
        include: {
            user: {
                include: { role: true },
            },
        },
    });

    return session;
};

// Validate session — kiểm tra hợp lệ, chưa thu hồi, chưa hết hạn
export const validateSession = (session) => {
    if (!session) {
        throw new Error("Session không tồn tại");
    }
    if (session.isRevoked) {
        throw new Error("Session đã bị thu hồi");
    }
    if (new Date() > session.expiresAt) {
        throw new Error("Session đã hết hạn");
    }
    return true;
};

// Thu hồi 1 session (logout thiết bị hiện tại)
export const revokeSession = async (refreshToken) => {
    const session = await prisma.session.findUnique({
        where: { refreshToken },
    });

    if (!session) return null;

    return prisma.session.update({
        where: { refreshToken },
        data: { isRevoked: true },
    });
};

// Thu hồi toàn bộ session của user (logout all devices)
export const revokeAllUserSessions = async (userId) => {
    return prisma.session.updateMany({
        where: {
            userId,
            isRevoked: false,
        },
        data: { isRevoked: true },
    });
};

// Lấy danh sách session đang active của user
export const getActiveSessions = async (userId) => {
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

// Xóa session hết hạn hoặc đã thu hồi — dùng cho cron job
export const deleteExpiredSessions = async () => {
    const result = await prisma.session.deleteMany({
        where: {
            OR: [
                { expiresAt: { lt: new Date() } },
                { isRevoked: true },
            ],
        },
    });

    return result.count;
};