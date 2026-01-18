import prisma from "../../config/client.js";

export const getTargetsServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await prisma.$transaction([
        prisma.target.findMany({
            skip,
            take: limit,
            orderBy: { id: "desc" },
        }),
        prisma.target.count(),
    ]);

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};


export const getTargetByIdServices = async (id) => {
    const target = await prisma.target.findUnique({
        where: { id }
    });

    if (!target) throw new Error("Mục tiêu không tồn tại");

    return target;
};

export const createTargetServices = async (data) => {
    const name = data.name.trim();

    const existed = await prisma.target.findFirst({
        where: { name }
    });

    if (existed) {
        throw new Error("Tên mục tiêu đã tồn tại");
    }

    return prisma.target.create({
        data: {
            name,
            description: data.description || ""
        }
    });
};


export const updateTargetServices = async (id, data) => {
    const existTarget = await prisma.target.findUnique({
        where: { id }
    });

    if (!existTarget) throw new Error("Mục tiêu không tồn tại");

    if (data.name) {
        const duplicated = await prisma.target.findFirst({
            where: {
                name: data.name,
                NOT: { id }
            }
        });
        if (duplicated) throw new Error("Tên mục tiêu đã tồn tại");
    }

    return prisma.target.update({
        where: { id },
        data
    });
};

export const deleteTargetServices = async (id) => {
    const existTarget = await prisma.target.findUnique({
        where: { id }
    });

    if (!existTarget) throw new Error("Mục tiêu không tồn tại");

    await prisma.target.delete({
        where: { id }
    });

    return true;
};
