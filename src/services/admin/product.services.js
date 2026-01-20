import prisma from "../../config/client.js";
import slugify from "slugify";
export const createProductServices = async (data) => {
    const {
        name,
        description,
        brandId,
        categoryId,
        targetId,
        thumbnail,
    } = data;

    if (!thumbnail) {
        throw new Error("Vui lòng chọn ảnh sản phẩm");
    }

    const slug = slugify(name, {
        lower: true,
        strict: true,
        locale: "vi",
    });

    const [existedProduct, existedSlug, brand, category, target] =
        await Promise.all([
            prisma.product.findFirst({ where: { name } }),
            prisma.product.findUnique({ where: { slug } }),
            prisma.brand.findUnique({ where: { id: brandId } }),
            prisma.category.findUnique({ where: { id: categoryId } }),
            prisma.target.findUnique({ where: { id: targetId } }),
        ]);

    if (existedProduct) throw new Error("Tên sản phẩm đã tồn tại");
    if (existedSlug) throw new Error("Slug sản phẩm đã tồn tại");
    if (!brand) throw new Error("Brand không tồn tại");
    if (!category) throw new Error("Category không tồn tại");
    if (!target) throw new Error("Target không tồn tại");

    return prisma.product.create({
        data: {
            name,
            slug,
            description: description ?? "",
            thumbnail,
            quantity: 0, // ⚠️ cache field – không set từ API
            isActive: true,
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
            where: {
                deletedAt: null,
            },
            skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                brand: true,
                category: true,
                target: true,
                colors: {
                    include: { storages: true },
                },
            },
        }),
        prisma.product.count({
            where: { deletedAt: null },
        }),
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

        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        // 🔹 Validate relation nếu có update
        const [brand, category, target] = await Promise.all([
            data.brandId !== undefined
                ? tx.brand.findUnique({ where: { id: data.brandId } })
                : null,
            data.categoryId !== undefined
                ? tx.category.findUnique({ where: { id: data.categoryId } })
                : null,
            data.targetId !== undefined
                ? tx.target.findUnique({ where: { id: data.targetId } })
                : null,
        ]);

        if (data.brandId !== undefined && !brand)
            throw new Error("Brand không tồn tại");

        if (data.categoryId !== undefined && !category)
            throw new Error("Category không tồn tại");

        if (data.targetId !== undefined && !target)
            throw new Error("Target không tồn tại");

        // 🔹 Nếu đổi name → check trùng + tạo slug mới
        let newSlug = product.slug;

        if (data.name && data.name !== product.name) {
            newSlug = slugify(data.name, {
                lower: true,
                strict: true,
                locale: "vi",
            });

            const existedSlug = await tx.product.findFirst({
                where: {
                    slug: newSlug,
                    NOT: { id: Number(id) },
                },
            });

            if (existedSlug) {
                throw new Error("Slug sản phẩm đã tồn tại");
            }
        }

        return tx.product.update({
            where: { id: Number(id) },
            data: {
                name: data.name ?? product.name,
                slug: newSlug,
                description: data.description ?? product.description,
                isActive:
                    data.isActive !== undefined
                        ? data.isActive
                        : product.isActive,
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

        // ✅ Chưa bán → hard delete
        await tx.product.delete({
            where: { id: Number(id) },
        });

        return {
            type: "HARD_DELETE",
            message: "Xóa sản phẩm thành công",
        };
    });
};
