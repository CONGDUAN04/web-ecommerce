import prisma from "../../config/client.js";

const parsePrice = (price) =>
    typeof price === "string"
        ? Number(price.replace(/\./g, ""))
        : price;

export const createStorageServices = async ({ colorId, storages }) => {
    const color = await prisma.colorVariant.findUnique({
        where: { id: +colorId },
        include: { product: true },
    });

    if (!color) throw new Error("Màu sản phẩm không tồn tại");

    const createdStorages = await prisma.$transaction(
        storages.map((s) =>
            prisma.storageVariant.create({
                data: {
                    name: s.name,
                    price: parsePrice(s.price),
                    quantity: s.quantity,
                    colorId: +colorId,
                },
            })
        )
    );

    const totalQuantity = await prisma.storageVariant.aggregate({
        where: {
            color: { productId: color.productId },
        },
        _sum: { quantity: true },
    });

    await prisma.product.update({
        where: { id: color.productId },
        data: {
            quantity: totalQuantity._sum.quantity || 0,
        },
    });

    return {
        storages: createdStorages,
        productQuantity: totalQuantity._sum.quantity || 0,
    };
};

export const getStoragesServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await prisma.$transaction([
        prisma.storageVariant.findMany({
            skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                color: {
                    include: {
                        product: true,
                    },
                },
            },
        }),
        prisma.storageVariant.count(),
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

export const getStorageByIdServices = async (id) => {
    const storage = await prisma.storageVariant.findUnique({
        where: { id },
        include: {
            color: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!storage) throw new Error("Dung lượng không tồn tại");

    return storage;
};

export const updateStorageServices = async (id, data) => {
    const existStorage = await prisma.storageVariant.findUnique({
        where: { id },
        include: {
            color: { include: { product: true } },
        },
    });

    if (!existStorage) throw new Error("Dung lượng không tồn tại");

    const updated = await prisma.storageVariant.update({
        where: { id },
        data: {
            name: data.name ?? existStorage.name,
            price:
                data.price !== undefined
                    ? parsePrice(data.price)
                    : existStorage.price,
            quantity:
                data.quantity !== undefined
                    ? +data.quantity
                    : existStorage.quantity,
        },
    });

    const totalQuantity = await prisma.storageVariant.aggregate({
        where: {
            color: { productId: existStorage.color.productId },
        },
        _sum: { quantity: true },
    });

    await prisma.product.update({
        where: { id: existStorage.color.productId },
        data: {
            quantity: totalQuantity._sum.quantity || 0,
        },
    });

    return updated;
};

export const deleteStorageServices = async (id) => {
    const existStorage = await prisma.storageVariant.findUnique({
        where: { id },
        include: {
            color: { include: { product: true } },
        },
    });

    if (!existStorage) throw new Error("Dung lượng không tồn tại");

    await prisma.storageVariant.delete({ where: { id } });

    const totalQuantity = await prisma.storageVariant.aggregate({
        where: {
            color: { productId: existStorage.color.productId },
        },
        _sum: { quantity: true },
    });

    await prisma.product.update({
        where: { id: existStorage.color.productId },
        data: {
            quantity: totalQuantity._sum.quantity || 0,
        },
    });

    return true;
};
