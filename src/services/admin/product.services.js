import prisma from "../../config/client.js";

export const createProductServices = async (data) => {
    const { name, brandId, categoryId, targetId, thumbnail } = data;

    if (!thumbnail) throw new Error("Vui lòng chọn ảnh sản phẩm");

    const existedProduct = await prisma.product.findFirst({
        where: { name },
    });
    if (existedProduct) throw new Error("Tên sản phẩm đã tồn tại");

    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) throw new Error("Brand không tồn tại");

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new Error("Category không tồn tại");

    const target = await prisma.target.findUnique({ where: { id: targetId } });
    if (!target) throw new Error("Target không tồn tại");

    return prisma.product.create({
        data: {
            name,
            description: data.description ?? "",
            thumbnail,
            quantity: 0,
            brandId,
            categoryId,
            targetId,
        },
        include: {
            brand: true,
            category: true,
            target: true,
        },
    });
};

export const getProductsServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.product.findMany({
            skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                brand: true,
                category: true,
                target: true,
                colors: {
                    include: {
                        storages: true,
                    },
                },
            },
        }),
        prisma.product.count(),
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

export const getProductByIdServices = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
            brand: true,
            category: true,
            target: true,
            colors: {
                include: {
                    storages: true,
                },
            },
        },
    });

    if (!product) throw new Error("Sản phẩm không tồn tại");
    return product;
};

export const updateProductServices = async (id, data, thumbnail) => {
    return prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: Number(id) },
        });

        if (!product) throw new Error("Sản phẩm không tồn tại");

        if (data.brandId !== undefined) {
            const brand = await tx.brand.findUnique({
                where: { id: data.brandId },
            });
            if (!brand) throw new Error("Brand không tồn tại");
        }

        if (data.categoryId !== undefined) {
            const category = await tx.category.findUnique({
                where: { id: data.categoryId },
            });
            if (!category) throw new Error("Category không tồn tại");
        }

        if (data.targetId !== undefined) {
            const target = await tx.target.findUnique({
                where: { id: data.targetId },
            });
            if (!target) throw new Error("Target không tồn tại");
        }

        return tx.product.update({
            where: { id: Number(id) },
            data: {
                name: data.name ?? product.name,
                description: data.description ?? product.description,
                isActive: data.isActive ?? product.isActive,
                brandId: data.brandId ?? product.brandId,
                categoryId: data.categoryId ?? product.categoryId,
                targetId: data.targetId ?? product.targetId,
                ...(thumbnail && { thumbnail }),
            },
            include: {
                brand: true,
                category: true,
                target: true,
            },
        });
    });
};

export const deleteProductServices = async (id) => {
    return prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: Number(id) },
        });
        if (!product) throw new Error("Sản phẩm không tồn tại");

        const sold = await tx.orderDetailVariant.findFirst({
            where: {
                storage: {
                    color: {
                        productId: Number(id),
                    },
                },
            },
        });

        if (sold) {
            await tx.product.update({
                where: { id: Number(id) },
                data: {
                    isActive: false,
                    deletedAt: new Date(),
                },
            });

            return {
                type: "SOFT_DELETE",
                message: "Sản phẩm đã được ngừng bán",
            };
        }

        await tx.product.delete({
            where: { id: Number(id) },
        });

        return {
            type: "HARD_DELETE",
            message: "Xóa sản phẩm thành công",
        };
    });
};
