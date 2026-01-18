import prisma from "../../config/client.js";
import { ACCOUNT_TYPE } from "../../config/constant.js";
import { hashPassword } from "../../utils/hashPassword.js";

export const createUserServices = async (data, avatar) => {
    // Check username tồn tại
    const existUser = await prisma.user.findUnique({
        where: { username: data.username }
    });
    if (existUser) throw new Error("Username đã tồn tại");

    // Check roleId (bắt buộc)
    const role = await prisma.role.findUnique({
        where: { id: data.roleId }
    });
    if (!role) throw new Error("Role không tồn tại");

    // Hash password mặc định
    const passwordHashed = await hashPassword("123456");

    // Tạo user mới
    return prisma.user.create({
        data: {
            username: data.username,
            password: passwordHashed,
            fullName: data.fullName,
            address: data.address ?? null,
            phone: data.phone ?? null,
            avatar: avatar ?? null,
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: data.roleId
        },
        include: { role: true }
    });
};

export const getUsersServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            include: { role: true },
            orderBy: { id: "desc" }
        }),
        prisma.user.count()
    ]);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getUserByIdServices = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: { role: true }
    });

    if (!user) throw new Error("Người dùng không tồn tại");
    return user;
};

export const updateUserServices = async (id, data, avatar) => {
    const existUser = await prisma.user.findUnique({
        where: { id: Number(id) }
    });
    if (!existUser) throw new Error("Người dùng không tồn tại");

    // Check roleId nếu có trong data update
    if (data.roleId !== undefined && data.roleId !== null) {
        const role = await prisma.role.findUnique({
            where: { id: Number(data.roleId) }
        });
        if (!role) throw new Error("Role không tồn tại");
    }

    // Prepare update data
    const updateData = {};

    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phone !== undefined) {
        // Nếu phone là empty string hoặc null thì set null
        updateData.phone = data.phone === "" ? null : data.phone;
    }
    if (data.roleId !== undefined) {
        updateData.roleId = data.roleId === "" ? null : data.roleId;
    }
    if (avatar) updateData.avatar = avatar;

    // Update user
    return prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
        include: { role: true }
    });
};

export const deleteUserServices = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(id) }
    });
    if (!user) throw new Error("Người dùng không tồn tại");

    const orderCount = await prisma.order.count({
        where: { userId: Number(id) }
    });
    if (orderCount > 0) {
        throw new Error("Không thể xóa người dùng đã có đơn hàng");
    }

    await prisma.user.delete({
        where: { id: Number(id) }
    });

    return true;
};

// GET ROLES
export const getRolesServices = async () => {
    return prisma.role.findMany({
        orderBy: { id: "asc" }
    });
};