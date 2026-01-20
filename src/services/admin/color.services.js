import prisma from "../../config/client.js";

export const getColorsServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.colorVariant.findMany({
            skip: +skip,
            take: +limit,
            orderBy: { id: "desc" },
            include: {
                product: true,
            },
        }),
        prisma.colorVariant.count(),
    ]);

    return {
        items,
        pagination: {
            page: +page,
            limit: +limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getColorByIdServices = async (id) => {
    const color = await prisma.colorVariant.findUnique({
        where: { id: +id },
        include: {
            product: true,
            storages: true,
        },
    });
    if (!color) throw new Error("Màu sản phẩm không tồn tại");
    return color;
};

export const createColorServices = async (data) => {
    const { color, image, productId } = data;

    if (!image) throw new Error("Vui lòng upload ảnh màu sản phẩm");

    const product = await prisma.product.findUnique({
        where: { id: +productId },
    });
    if (!product) throw new Error("Sản phẩm không tồn tại");

    const existed = await prisma.colorVariant.findFirst({
        where: {
            color,
            productId: +productId,
        },
    });
    if (existed) throw new Error("Màu này đã tồn tại cho sản phẩm");

    return prisma.colorVariant.create({
        data: {
            color,
            image,
            productId: +productId,
        },
    });
};

export const updateColorServices = async (id, data, image) => {
    const existColor = await prisma.colorVariant.findUnique({
        where: { id: +id },
    });
    if (!existColor) throw new Error("Màu sản phẩm không tồn tại");

    if (data.color) {
        const duplicate = await prisma.colorVariant.findFirst({
            where: {
                color: data.color,
                productId: data.productId
                    ? +data.productId
                    : existColor.productId,
                NOT: { id: +id },
            },
        });
        if (duplicate) throw new Error("Màu này đã tồn tại cho sản phẩm");
    }

    return prisma.colorVariant.update({
        where: { id: +id },
        data: {
            ...data,
            ...(image && { image }),
        },
    });
};


export const deleteColorServices = async (id) => {
    const colorId = Number(id);

    const color = await prisma.colorVariant.findUnique({
        where: { id: colorId },
    });

    if (!color) {
        throw new Error("Màu sản phẩm không tồn tại");
    }

    const orderCount = await prisma.orderDetailVariant.count({
        where: {
            storage: {
                colorId: colorId,
            },
        },
    });

    if (orderCount > 0) {
        throw new Error(
            "Màu sản phẩm đã phát sinh đơn hàng, không thể xóa"
        );
    }
    await prisma.$transaction(async (tx) => {
        await tx.storageVariant.deleteMany({
            where: {
                colorId: colorId,
            },
        });
        await tx.colorVariant.delete({
            where: {
                id: colorId,
            },
        });
    });
};




