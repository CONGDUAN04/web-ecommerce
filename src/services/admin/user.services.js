import prisma from "../../config/client.js";
import { ACCOUNT_TYPE } from "../../config/constant.js";
import { hashPassword } from "../../utils/hashPassword.js";

export const createUserServices = async (data, avatar) => {
    const existUser = await prisma.user.findUnique({
        where: { username: data.username }
    });
    if (existUser) throw new Error("Username đã tồn tại");
    if (data.phone) {
        const existPhone = await prisma.user.findUnique({
            where: { phone: data.phone }
        });
        if (existPhone) throw new Error("Số điện thoại đã tồn tại");
    }
    const role = await prisma.role.findUnique({
        where: { id: data.roleId }
    });
    if (!role) throw new Error("Role không tồn tại");
    const passwordHashed = await hashPassword("123456");

    // Tạo user mới
    return prisma.user.create({
        data: {
            username: data.username,
            password: passwordHashed,
            fullName: data.fullName,
            phone: data.phone ?? null,
            avatar: avatar ?? null,
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: +data.roleId
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
    const userId = Number(id);

    const existUser = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!existUser) throw new Error("Người dùng không tồn tại");

    // Check role
    if (data.roleId !== undefined && data.roleId !== null && data.roleId !== "") {
        const role = await prisma.role.findUnique({
            where: { id: Number(data.roleId) }
        });
        if (!role) throw new Error("Role không tồn tại");
    }

    // Check trùng phone
    if (data.phone !== undefined && data.phone !== null && data.phone !== "") {
        const existPhone = await prisma.user.findFirst({
            where: {
                phone: data.phone,
                NOT: { id: userId }
            }
        });
        if (existPhone) throw new Error("Số điện thoại đã tồn tại");
    }

    const updateData = {};

    if (data.fullName !== undefined) {
        updateData.fullName = data.fullName;
    }

    if (data.phone !== undefined) {
        updateData.phone = data.phone === "" ? null : data.phone;
    }

    if (data.roleId !== undefined) {
        updateData.roleId = data.roleId === "" ? null : Number(data.roleId);
    }

    if (avatar) {
        updateData.avatar = avatar;
    }

    return prisma.user.update({
        where: { id: userId },
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

