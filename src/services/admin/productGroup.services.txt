import prisma from "../../config/client.js";
import { slugify } from "../../utils/slugify.js";

export const getProductGroupsServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.productGroup.findMany({
            where: { isActive: true },

            skip,
            take: limit,

            orderBy: { id: "desc" },

            include: {
                brand: true,
                category: true,
                products: true
            }
        }),

        prisma.productGroup.count({
            where: { isActive: true }
        })
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

export const getProductGroupByIdServices = async (id) => {
    const productGroup = await prisma.productGroup.findUnique({
        where: { id: Number(id) },

        include: {
            brand: true,
            category: true,
            products: true
        }
    });

    if (!productGroup) {
        throw new Error("Product group không tồn tại");
    }

    return productGroup;
};

export const createProductGroupServices = async (data) => {
    const slug = slugify(data.name);

    const exist = await prisma.productGroup.findUnique({
        where: { slug }
    });

    if (exist) {
        throw new Error("Product group đã tồn tại");
    }

    const brand = await prisma.brand.findUnique({
        where: { id: Number(data.brandId) }
    });

    if (!brand) {
        throw new Error("Brand không tồn tại");
    }

    const category = await prisma.category.findUnique({
        where: { id: Number(data.categoryId) }
    });

    if (!category) {
        throw new Error("Category không tồn tại");
    }

    return prisma.productGroup.create({
        data: {
            name: data.name,
            slug,
            brandId: Number(data.brandId),
            categoryId: Number(data.categoryId),
            description: data.description,
            thumbnail: data.thumbnail
        }
    });
};

export const updateProductGroupServices = async (id, data) => {
    id = Number(id);

    const exist = await prisma.productGroup.findUnique({
        where: { id }
    });

    if (!exist) {
        throw new Error("Product group không tồn tại");
    }

    const updateData = {};

    if (data.name) {
        const slug = slugify(data.name);

        const duplicated = await prisma.productGroup.findFirst({
            where: {
                slug,
                NOT: { id }
            }
        });

        if (duplicated) {
            throw new Error("Tên product group đã tồn tại");
        }

        updateData.name = data.name;
        updateData.slug = slug;
    }

    if (data.brandId) {
        updateData.brandId = Number(data.brandId);
    }

    if (data.categoryId) {
        updateData.categoryId = Number(data.categoryId);
    }

    if (data.description !== undefined) {
        updateData.description = data.description;
    }

    if (data.thumbnail !== undefined) {
        updateData.thumbnail = data.thumbnail;
    }

    if (data.isActive !== undefined) {
        updateData.isActive = Boolean(data.isActive);
    }

    return prisma.productGroup.update({
        where: { id },
        data: updateData
    });
};

export const deleteProductGroupServices = async (id) => {
    id = Number(id);

    const exist = await prisma.productGroup.findUnique({
        where: { id }
    });

    if (!exist) {
        throw new Error("Product group không tồn tại");
    }

    const productCount = await prisma.product.count({
        where: { productGroupId: id }
    });

    if (productCount > 0) {
        throw new Error("Không thể xóa product group đang có sản phẩm");
    }

    await prisma.productGroup.update({
        where: { id },
        data: { isActive: false }
    });

    return true;
};