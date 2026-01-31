import prisma from "../../config/client.js";

export const getColorsServices = async ({
    page = 1,
    limit = 10,
    productId
}) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const where = {};
    if (productId) where.productId = Number(productId);

    const [items, total] = await Promise.all([
        prisma.colorVariant.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                product: {
                    include: {
                        productGroup: true
                    }
                }
            }
        }),
        prisma.colorVariant.count({ where })
    ]);

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const createColorServices = async (data) => {
    const { color, price, productId, image } = data;

    const product = await prisma.product.findUnique({
        where: { id: Number(productId) }
    });

    if (!product) throw new Error("Sản phẩm không tồn tại");

    const existed = await prisma.colorVariant.findFirst({
        where: {
            productId: Number(productId),
            color
        }
    });

    if (existed) throw new Error("Màu đã tồn tại");

    return prisma.colorVariant.create({
        data: {
            color,
            price: Number(price),
            quantity: 0,
            image,
            productId: Number(productId)
        }
    });
};

export const updateColorServices = async (id, data, image) => {
    id = Number(id);
    const color = await prisma.colorVariant.findUnique({
        where: { id }
    });
    if (!color) throw new Error("Color không tồn tại");

    const updateData = {};

    if (data.color !== undefined) updateData.color = data.color;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (image) updateData.image = image;

    if (data.quantity !== undefined) {
        throw new Error("Không cho phép update quantity trực tiếp");
    }
    return prisma.colorVariant.update({
        where: { id },
        data: updateData
    });
};

export const deleteColorServices = async (id) => {
    id = Number(id);

    return prisma.$transaction(async (tx) => {

        const color = await tx.colorVariant.findUnique({
            where: { id },
            include: {
                orderItems: { take: 1 }
            }
        });

        if (!color) throw new Error("Color không tồn tại");

        if (color.orderItems.length > 0) {
            return tx.colorVariant.update({
                where: { id },
                data: { isActive: false }
            });
        }

        if (color.quantity > 0) {
            await tx.inventoryLog.create({
                data: {
                    action: "EXPORT",
                    quantity: color.quantity,
                    colorId: id,
                    note: "Delete variant"
                }
            });
        }

        // xoá cart trước
        await tx.cartItem.deleteMany({
            where: { colorId: id }
        });

        // xoá variant
        await tx.colorVariant.delete({
            where: { id }
        });

        // cập nhật lại tổng quantity product
        const sum = await tx.colorVariant.aggregate({
            where: { productId: color.productId },
            _sum: { quantity: true }
        });

        await tx.product.update({
            where: { id: color.productId },
            data: {
                quantity: sum._sum.quantity ?? 0
            }
        });

        return true;
    });
};


