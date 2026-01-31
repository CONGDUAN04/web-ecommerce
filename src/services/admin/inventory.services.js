import prisma from "../../config/client.js";

/**
 * Recalculate product quantity cache
 */
const recalcProductQty = async (tx, productId) => {
    const sum = await tx.colorVariant.aggregate({
        where: { productId },
        _sum: { quantity: true }
    });

    await tx.product.update({
        where: { id: productId },
        data: {
            quantity: sum._sum.quantity || 0
        }
    });
};

/**
 * IMPORT
 */
export const importInventoryServices = async ({ colorId, quantity, note }) => {

    return prisma.$transaction(async tx => {

        await tx.$executeRaw`
    SELECT id FROM color_variants WHERE id=${colorId} FOR UPDATE
   `;

        const color = await tx.colorVariant.findUnique({
            where: { id: +colorId }
        });

        if (!color) throw new Error("Color không tồn tại");

        await tx.inventoryLog.create({
            data: { action: "IMPORT", quantity, colorId, note }
        });

        await tx.colorVariant.update({
            where: { id: +colorId },
            data: { quantity: { increment: quantity } }
        });

        await recalcProductQty(tx, color.productId);
    });
};


export const exportInventoryServices = async ({ colorId, quantity, note }) => {
    colorId = Number(colorId);
    quantity = Number(quantity);

    if (quantity <= 0) throw new Error("Quantity phải > 0");

    return prisma.$transaction(async (tx) => {

        await tx.$executeRaw`SELECT id FROM color_variants WHERE id=${colorId} FOR UPDATE`;

        const color = await tx.colorVariant.findUnique({
            where: { id: colorId }
        });

        if (!color) throw new Error("Color không tồn tại");

        if (color.quantity < quantity) throw new Error("Không đủ tồn kho");

        await tx.inventoryLog.create({
            data: {
                action: "EXPORT",
                quantity,
                colorId,
                note
            }
        });

        await tx.colorVariant.update({
            where: { id: colorId },
            data: {
                quantity: { decrement: quantity }
            }
        });

        await recalcProductQty(tx, color.productId);

        return true;
    });
};

export const adjustInventoryServices = async ({ colorId, quantity, note }) => {
    colorId = Number(colorId);
    quantity = Number(quantity);
    return prisma.$transaction(async (tx) => {

        await tx.$executeRaw`SELECT id FROM color_variants WHERE id=${colorId} FOR UPDATE`;

        const color = await tx.colorVariant.findUnique({
            where: { id: colorId }
        });

        if (!color) throw new Error("Color không tồn tại");

        if (color.quantity + quantity < 0)
            throw new Error("Adjust làm tồn kho âm");

        await tx.inventoryLog.create({
            data: {
                action: "ADJUST",
                quantity: Math.abs(quantity),
                colorId,
                note
            }
        });

        await tx.colorVariant.update({
            where: { id: colorId },
            data: {
                quantity: { increment: quantity }
            }
        });

        await recalcProductQty(tx, color.productId);

        return true;
    });
};


export const getInventoryLogsServices = async ({ colorId }) => {
    const where = {};
    if (colorId) where.colorId = Number(colorId);
    return prisma.inventoryLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            color: {
                select: {
                    id: true,
                    color: true,
                    quantity: true
                }
            }
        }
    });
};
