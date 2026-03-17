import prisma from "../../config/client.js";
import { generateSlug } from "../../utils/slug.js";

const productInclude = {
    brand: { select: { id: true, name: true, slug: true, logo: true } },
    category: { select: { id: true, name: true, slug: true } },
    group: { select: { id: true, name: true, slug: true, series: true } }
};

// ========================
// GET LIST
// ========================

export const getProductsServices = async ({
    page = 1,
    limit = 10,
    groupId,
    brandId,
    categoryId,
    search
}) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const where = { isActive: true };
    if (groupId) where.groupId = Number(groupId);
    if (brandId) where.brandId = Number(brandId);
    if (categoryId) where.categoryId = Number(categoryId);
    if (search) where.name = { contains: search };

    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                ...productInclude,
                variants: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        color: true,
                        storage: true,
                        price: true,
                        comparePrice: true,
                        quantity: true
                    },
                    orderBy: { price: "asc" }
                },
                _count: { select: { variants: true, reviews: true } }
            }
        }),
        prisma.product.count({ where })
    ]);

    return {
        items,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
};

// ========================
// GET BY ID
// ========================

export const getProductByIdServices = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
            ...productInclude,
            variants: {
                where: { isActive: true },
                orderBy: [{ storage: "asc" }, { color: "asc" }]
            },
            images: { orderBy: { sortOrder: "asc" } },
            specifications: true,
            _count: { select: { reviews: true } }
        }
    });

    if (!product) throw new Error("Sản phẩm không tồn tại");
    return product;
};

// ========================
// GET BY SLUG
// ========================

export const getProductBySlugServices = async (slug) => {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            ...productInclude,
            variants: {
                where: { isActive: true },
                orderBy: [{ storage: "asc" }, { color: "asc" }]
            },
            images: { orderBy: { sortOrder: "asc" } },
            specifications: true,
            _count: { select: { reviews: true } }
        }
    });

    if (!product) throw new Error("Sản phẩm không tồn tại");

    await prisma.product.update({
        where: { slug },
        data: { viewCount: { increment: 1 } }
    });

    return product;
};

// ========================
// CREATE
// ========================

export const createProductServices = async (data) => {
    const slug = generateSlug(data.name);

    const exist = await prisma.product.findUnique({ where: { slug } });
    if (exist) throw new Error("Tên sản phẩm đã tồn tại");

    // groupId bắt buộc → luôn lấy brandId/categoryId từ group
    const group = await prisma.productGroup.findUnique({
        where: { id: Number(data.groupId) }
    });
    if (!group) throw new Error("Product group không tồn tại");
    if (!group.isActive) throw new Error("Product group đã bị ẩn");

    return prisma.product.create({
        data: {
            name: data.name,
            slug,
            groupId: group.id,
            brandId: group.brandId,    // tự fill từ group
            categoryId: group.categoryId, // tự fill từ group
            description: data.description ?? null,
            thumbnail: data.thumbnail ?? null
        },
        include: productInclude
    });
};

// ========================
// UPDATE
// ========================

export const updateProductServices = async (id, data) => {
    id = Number(id);

    const exist = await prisma.product.findUnique({ where: { id } });
    if (!exist) throw new Error("Sản phẩm không tồn tại");

    const updateData = {};

    if (data.name) {
        const slug = generateSlug(data.name);
        const duplicated = await prisma.product.findFirst({
            where: { slug, NOT: { id } }
        });
        if (duplicated) throw new Error("Tên sản phẩm đã tồn tại");
        updateData.name = data.name;
        updateData.slug = slug;
    }

    // Đổi group → brandId/categoryId tự đồng bộ theo group mới
    if (data.groupId !== undefined) {
        const group = await prisma.productGroup.findUnique({
            where: { id: Number(data.groupId) }
        });
        if (!group) throw new Error("Product group không tồn tại");
        if (!group.isActive) throw new Error("Product group đã bị ẩn");

        updateData.groupId = group.id;
        updateData.brandId = group.brandId;    // tự đồng bộ
        updateData.categoryId = group.categoryId; // tự đồng bộ
    }

    if (data.description !== undefined) updateData.description = data.description;
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

    return prisma.product.update({
        where: { id },
        data: updateData,
        include: productInclude
    });
};

// ========================
// DELETE (soft delete)
// ========================

export const deleteProductServices = async (id) => {
    id = Number(id);

    const exist = await prisma.product.findUnique({ where: { id } });
    if (!exist) throw new Error("Sản phẩm không tồn tại");

    await prisma.product.update({
        where: { id },
        data: { isActive: false }
    });

    return true;
};