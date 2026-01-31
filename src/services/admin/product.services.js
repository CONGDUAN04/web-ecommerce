import prisma from "../../config/client.js";
import slugify from "slugify";

export const getProductsServices = async ({
    page = 1,
    limit = 10,
    productGroupId
}) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const where = {};
    if (productGroupId) {
        where.productGroupId = Number(productGroupId);
    }

    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                colors: true,
                productGroup: {
                    include: {
                        brand: true,
                        category: true
                    }
                }
            }
        }),
        prisma.product.count({ where })
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

export const getProductByIdServices = async (id) => {
    id = Number(id);

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            productGroup: {
                include: {
                    brand: true,
                    category: true
                }
            },
            colors: true,
            images: true,
            specifications: true
        }
    });

    if (!product) throw new Error("Sản phẩm không tồn tại");

    return product;
};

export const createProductServices = async (data) => {
    const { name, productGroupId, description, thumbnail } = data;

    const group = await prisma.productGroup.findUnique({
        where: { id: Number(productGroupId) }
    });

    if (!group) throw new Error("Product group không tồn tại");

    // chống trùng variant trong cùng group
    const existed = await prisma.product.findFirst({
        where: {
            productGroupId: Number(productGroupId),
            name
        }
    });

    if (existed) throw new Error("Phiên bản đã tồn tại");

    const slug = slugify(`${group.name} ${name}`, {
        lower: true,
        strict: true
    });

    return prisma.product.create({
        data: {
            name,
            slug,
            description: description || "",
            thumbnail,
            productGroupId: Number(productGroupId)
        }
    });
};


export const updateProductServices = async (id, data, thumbnail) => {
    id = Number(id);

    return prisma.$transaction(async (tx) => {
        // lock row
        await tx.$executeRaw`
      SELECT id FROM products WHERE id=${id} FOR UPDATE
    `;

        const product = await tx.product.findUnique({
            where: { id },
            include: { productGroup: true }
        });

        if (!product) throw new Error("Sản phẩm không tồn tại");

        const updateData = {};

        if (data.name !== undefined) {
            const orderCount = await tx.orderItem.count({
                where: {
                    color: {
                        productId: id
                    }
                }
            });

            if (orderCount > 0)
                throw new Error("Không thể đổi phiên bản vì đã phát sinh giao dịch");

            const duplicated = await tx.product.findFirst({
                where: {
                    productGroupId: product.productGroupId,
                    name: data.name,
                    NOT: { id }
                }
            });

            if (duplicated) throw new Error("Phiên bản đã tồn tại");

            const fullName = `${product.productGroup.name} ${data.name}`;

            updateData.name = data.name;
            updateData.slug = slugify(fullName, { lower: true, strict: true });
        }

        if (data.description !== undefined)
            updateData.description = data.description;
        if (thumbnail)
            updateData.thumbnail = thumbnail;
        if (data.isActive !== undefined) {
            updateData.isActive = Boolean(data.isActive);
        }
        return tx.product.update({
            where: { id },
            data: updateData
        });
    });
};

export const deleteProductServices = async (id) => {
    id = Number(id);

    return prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id },
            include: {
                colors: {
                    include: {
                        orderItems: { take: 1 }
                    }
                }
            }
        });

        if (!product) throw new Error("Sản phẩm không tồn tại");

        const hasOrder = product.colors.some(
            c => c.orderItems.length > 0
        );
        if (hasOrder) {
            return tx.product.update({
                where: { id },
                data: { isActive: false }
            });
        }
        await tx.cartItem.deleteMany({
            where: {
                color: {
                    productId: id
                }
            }
        });

        await tx.colorVariant.deleteMany({
            where: { productId: id }
        });

        await tx.productImage.deleteMany({
            where: { productId: id }
        });

        await tx.specification.deleteMany({
            where: { productId: id }
        });

        await tx.wishlist.deleteMany({
            where: { productId: id }
        });

        await tx.product.delete({
            where: { id }
        });

        return true;
    });
};

