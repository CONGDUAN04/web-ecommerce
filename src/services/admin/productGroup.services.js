import prisma from "../../config/client.js";
import { generateSlug } from "../../utils/slug.js";

const groupInclude = {
    brand: { select: { id: true, name: true, slug: true, logo: true } },
    category: { select: { id: true, name: true, slug: true } }
};

// ========================
// GET LIST
// ========================

export const getProductGroupsServices = async ({
    page = 1,
    limit = 10,
    series,
    brandId,
    categoryId
}) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const where = { isActive: true };
    if (series) where.series = series;
    if (brandId) where.brandId = Number(brandId);
    if (categoryId) where.categoryId = Number(categoryId);

    const [items, total] = await Promise.all([
        prisma.productGroup.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                ...groupInclude,
                _count: { select: { products: true } }
            }
        }),
        prisma.productGroup.count({ where })
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

// ========================
// GET BY ID
// ========================

export const getProductGroupByIdServices = async (id) => {
    const productGroup = await prisma.productGroup.findUnique({
        where: { id: Number(id) },
        include: {
            ...groupInclude,
            products: {
                where: { isActive: true },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    thumbnail: true,
                    isActive: true,
                    createdAt: true,
                    _count: { select: { variants: true } }
                }
            }
        }
    });

    if (!productGroup) throw new Error("Product group không tồn tại");

    return productGroup;
};

// ========================
// CREATE
// ========================

export const createProductGroupServices = async (data) => {
    const slug = generateSlug(data.name);

    const exist = await prisma.productGroup.findUnique({ where: { slug } });
    if (exist) throw new Error("Tên product group đã tồn tại");

    const brand = await prisma.brand.findUnique({
        where: { id: Number(data.brandId) }
    });
    if (!brand) throw new Error("Brand không tồn tại");

    const category = await prisma.category.findUnique({
        where: { id: Number(data.categoryId) }
    });
    if (!category) throw new Error("Category không tồn tại");

    return prisma.productGroup.create({
        data: {
            name: data.name,
            slug,
            series: data.series ?? null,
            brandId: Number(data.brandId),
            categoryId: Number(data.categoryId),
            description: data.description ?? null,
            thumbnail: data.thumbnail ?? null
        },
        include: groupInclude
    });
};

// ========================
// UPDATE
// ========================

export const updateProductGroupServices = async (id, data) => {
    id = Number(id);

    const exist = await prisma.productGroup.findUnique({ where: { id } });
    if (!exist) throw new Error("Product group không tồn tại");

    const updateData = {};

    if (data.name) {
        const slug = generateSlug(data.name);
        const duplicated = await prisma.productGroup.findFirst({
            where: { slug, NOT: { id } }
        });
        if (duplicated) throw new Error("Tên product group đã tồn tại");
        updateData.name = data.name;
        updateData.slug = slug;
    }

    if (data.series !== undefined) updateData.series = data.series;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

    if (data.brandId !== undefined) {
        const brand = await prisma.brand.findUnique({
            where: { id: Number(data.brandId) }
        });
        if (!brand) throw new Error("Brand không tồn tại");
        updateData.brandId = Number(data.brandId);
    }

    if (data.categoryId !== undefined) {
        const category = await prisma.category.findUnique({
            where: { id: Number(data.categoryId) }
        });
        if (!category) throw new Error("Category không tồn tại");
        updateData.categoryId = Number(data.categoryId);
    }

    return prisma.productGroup.update({
        where: { id },
        data: updateData,
        include: groupInclude
    });
};

// ========================
// DELETE (soft delete)
// ========================

export const deleteProductGroupServices = async (id) => {
    id = Number(id);

    const exist = await prisma.productGroup.findUnique({ where: { id } });
    if (!exist) throw new Error("Product group không tồn tại");

    const productCount = await prisma.product.count({
        where: { groupId: id }
    });
    if (productCount > 0) {
        throw new Error(
            `Không thể xóa: product group đang chứa ${productCount} sản phẩm`
        );
    }

    await prisma.productGroup.update({
        where: { id },
        data: { isActive: false }
    });

    return true;
};