import prisma from "../../config/client.js";
import { hashPassword } from "../../utils/hashPassword.js";

// ─── select dùng chung — không bao giờ trả password ra ngoài ───────────────
const userSelect = {
    id: true,
    username: true,
    fullName: true,
    phone: true,
    avatar: true,
    accountType: true,
    createdAt: true,
    role: {
        select: { id: true, name: true }
    }
};

// ─────────────────────────────────────────────
// GET LIST
// ─────────────────────────────────────────────
export const getUsersServices = async ({ page = 1, limit = 10 }) => {
    const { page: p, limit: l, skip } = parsePagination({ page, limit });

    const [items, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: l,
            orderBy: { id: "desc" },
            select: userSelect
        }),
        prisma.user.count()
    ]);

    return {
        items,
        pagination: {
            page: p,
            limit: l,
            total,
            totalPages: Math.ceil(total / l)
        }
    };
};

// ─────────────────────────────────────────────
// GET BY ID
// ─────────────────────────────────────────────
export const getUserByIdServices = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: userSelect
    });

    if (!user) throw new Error("Người dùng không tồn tại");

    return user;
};

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────
export const createUserServices = async (data, avatar) => {
    // Check username trùng
    const existUsername = await prisma.user.findUnique({
        where: { username: data.username }
    });
    if (existUsername) throw new Error("Username đã tồn tại");

    // Check phone trùng
    if (data.phone) {
        const existPhone = await prisma.user.findFirst({
            where: { phone: data.phone }
        });
        if (existPhone) throw new Error("Số điện thoại đã tồn tại");
    }

    // Check role tồn tại
    const role = await prisma.role.findUnique({
        where: { id: Number(data.roleId) }
    });
    if (!role) throw new Error("Role không tồn tại");

    const hashedPassword = await hashPassword("123456");

    return prisma.user.create({
        data: {
            username: data.username,
            password: hashedPassword,
            fullName: data.fullName,
            phone: data.phone ?? null,
            avatar: avatar ?? null,
            accountType: "SYSTEM",
            roleId: Number(data.roleId)
        },
        select: userSelect
    });
};

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────
export const updateUserServices = async (id, data, avatar) => {
    const userId = Number(id);

    const existing = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!existing) throw new Error("Người dùng không tồn tại");

    // Check phone trùng với user khác
    if (data.phone) {
        const existPhone = await prisma.user.findFirst({
            where: { phone: data.phone, NOT: { id: userId } }
        });
        if (existPhone) throw new Error("Số điện thoại đã tồn tại");
    }

    // Check role tồn tại
    if (data.roleId) {
        const role = await prisma.role.findUnique({
            where: { id: Number(data.roleId) }
        });
        if (!role) throw new Error("Role không tồn tại");
    }

    const updateData = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.roleId !== undefined) updateData.roleId = data.roleId ? Number(data.roleId) : null;
    if (avatar) updateData.avatar = avatar;

    return prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: userSelect
    });
};

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
export const deleteUserServices = async (id) => {
    const existing = await prisma.user.findUnique({
        where: { id: Number(id) }
    });
    if (!existing) throw new Error("Người dùng không tồn tại");

    const orderCount = await prisma.order.count({
        where: { userId: Number(id) }
    });
    if (orderCount > 0) {
        throw new Error(
            `Không thể xóa — người dùng đang có ${orderCount} đơn hàng`
        );
    }

    await prisma.user.delete({ where: { id: Number(id) } });

    return true;
};