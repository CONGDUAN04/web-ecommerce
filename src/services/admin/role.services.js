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
    });

    if (!role) throw new Error("Vai trò không tồn tại");
    return role;
};

export const createRoleServices = async (data) => {
    const existed = await prisma.role.findFirst({
        where: { name: data.name },
    });

    if (existed) {
        throw new Error("Tên vai trò đã tồn tại");
    }

    return prisma.role.create({
        data: {
            name: data.name,
            description: data.description,
        },
    });
};

export const updateRoleServices = async (id, data) => {
    const role = await prisma.role.findUnique({
        where: { id: Number(id) },
    });

    if (!role) throw new Error("Vai trò không tồn tại");

    if (data.name) {
        const duplicated = await prisma.role.findFirst({
            where: {
                name: data.name,
                NOT: { id: Number(id) },
            },
        });

        if (duplicated) throw new Error("Tên vai trò đã tồn tại");
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
        updateData.description = data.description;

    return prisma.role.update({
        where: { id: Number(id) },
        data: updateData,
    });
};

export const deleteRoleServices = async (id) => {
    const role = await prisma.role.findUnique({
        where: { id: Number(id) },
    });

    if (!role) throw new Error("Vai trò không tồn tại");

    const userCount = await prisma.user.count({
        where: { roleId: Number(id) },
    });

    if (userCount > 0) {
        throw new Error("Không thể xóa vai trò đang được sử dụng");
    }

    await prisma.role.delete({
        where: { id: Number(id) },
    });

    return true;
};
