// services/admin/target.services.js
import prisma from "../../config/client.js";

// Lấy tất cả mục tiêu
export const getTargetServices = async () => {
    return await prisma.target.findMany();
};

// Lấy mục tiêu theo ID
export const getTargetByIdServices = async (id) => {
    return await prisma.target.findUnique({
        where: { id: Number(id) }
    });
};

// Tạo mục tiêu mới
export const createTargetServices = async (data) => {
    const existTarget = await prisma.target.findFirst({
        where: { name: data.name }
    });

    if (existTarget) {
        throw new Error("Tên mục tiêu đã tồn tại");
    }

    return await prisma.target.create({
        data: {
            name: data.name,
            description: data.description
        }
    });
};

// Cập nhật mục tiêu
export const updateTargetServices = async (id, data) => {
    const existTarget = await prisma.target.findUnique({
        where: { id: Number(id) }
    });

    if (!existTarget) return null;

    if (data.name) {
        const duplicated = await prisma.target.findFirst({
            where: {
                name: data.name,
                NOT: { id: Number(id) }
            }
        });
        if (duplicated) throw new Error("Tên mục tiêu đã tồn tại");
    }

    return await prisma.target.update({
        where: { id: Number(id) },
        data: { ...data }
    });
};

// Xóa mục tiêu
export const deleteTargetServices = async (id) => {
    const existTarget = await prisma.target.findUnique({
        where: { id: Number(id) }
    });

    if (!existTarget) throw new Error("Mục tiêu không tồn tại");

    await prisma.target.delete({
        where: { id: Number(id) }
    });

    return true;
};
