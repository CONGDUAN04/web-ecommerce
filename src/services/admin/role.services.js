import prisma from "../../config/client.js";

export const getRolesServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.role.findMany({
            skip,
            take: limit,
            orderBy: { id: "desc" },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                _count: {
                    select: { users: true }, // đếm số user đang dùng role
                },
            },
        }),
        prisma.role.count(),
    ]);

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getRoleByIdServices = async (id) => {
    const role = await prisma.role.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            _count: {
                select: { users: true },
            },
        },
    });

    if (!role) throw new Error("Vai trò không tồn tại");

    return role;
};

export const createRoleServices = async (data) => {
    // Kiểm tra trùng tên (dùng findUnique vì name là @unique)
    const existed = await prisma.role.findUnique({
        where: { name: data.name },
    });

    if (existed) throw new Error("Tên vai trò đã tồn tại");

    return prisma.role.create({
        data: {
            name: data.name,
            description: data.description ?? null,
        },
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
        },
    });
};

export const updateRoleServices = async (id, data) => {
    const role = await prisma.role.findUnique({
        where: { id: Number(id) },
    });

    if (!role) throw new Error("Vai trò không tồn tại");

    // Kiểm tra tên mới có bị trùng không
    if (data.name && data.name !== role.name) {
        const duplicated = await prisma.role.findUnique({
            where: { name: data.name },
        });

        if (duplicated) throw new Error("Tên vai trò đã tồn tại");
    }

    // Chỉ update field được gửi lên
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;

    return prisma.role.update({
        where: { id: Number(id) },
        data: updateData,
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
        },
    });
};

export const deleteRoleServices = async (id) => {
    const role = await prisma.role.findUnique({
        where: { id: Number(id) },
    });

    if (!role) throw new Error("Vai trò không tồn tại");

    // Không cho xóa nếu còn user đang dùng
    const userCount = await prisma.user.count({
        where: { roleId: Number(id) },
    });

    if (userCount > 0) {
        throw new Error(`Không thể xóa — vai trò đang được dùng bởi ${userCount} người dùng`);
    }

    await prisma.role.delete({
        where: { id: Number(id) },
    });

    return true;
};