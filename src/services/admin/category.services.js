import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import { generateSlug } from "../../utils/slug.js";
export const getCategoriesServices = async ({ page = 1, limit = 10 }) => {
    const { page: p, limit: l, skip } = parsePagination({ page, limit });

    const [items, total] = await Promise.all([
        prisma.category.findMany({
            skip,
            take: l,
            orderBy: { id: "desc" },
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true,
                _count: {
                    select: { products: true }
                }
            }
        }),
        prisma.category.count()
    ]);

    return {
        items,
        pagination: {
            page: p,
            limit: l,
            total,
            totalPages: Math.ceil(total / l)
        }
    };
};

export const getCategoryByIdServices = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            _count: {
                select: { products: true }
            }
        }
    });

    if (!category) throw new Error("Danh mục không tồn tại");

    return category;
};

export const createCategoryServices = async (data) => {
    const existed = await prisma.category.findUnique({
        where: { name: data.name }
    });

    if (existed) throw new Error("Tên danh mục đã tồn tại");

    const baseSlug = generateSlug(data.name);
    const slugConflict = await prisma.category.findUnique({
        where: { slug: baseSlug }
    });
    const slug = slugConflict ? `${baseSlug}-${Date.now()}` : baseSlug;

    return prisma.category.create({
        data: {
            name: data.name,
            slug
        },
        select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true
        }
    });
};

export const updateCategoryServices = async (id, data) => {
    const category = await prisma.category.findUnique({
        where: { id: Number(id) }
    });

    if (!category) throw new Error("Danh mục không tồn tại");

    if (data.name && data.name !== category.name) {
        const duplicated = await prisma.category.findUnique({
            where: { name: data.name }
        });

        if (duplicated) throw new Error("Tên danh mục đã tồn tại");
    }

    const baseSlug = generateSlug(data.name);
    const slugConflict = await prisma.category.findFirst({
        where: { slug: baseSlug, NOT: { id: Number(id) } }
    });
    const slug = slugConflict ? `${baseSlug}-${Date.now()}` : baseSlug;

    return prisma.category.update({
        where: { id: Number(id) },
        data: { name: data.name, slug },
        select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true
        }
    });
};

export const deleteCategoryServices = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id: Number(id) }
    });

    if (!category) throw new Error("Danh mục không tồn tại");

    const productCount = await prisma.product.count({
        where: { categoryId: Number(id) }
    });

    if (productCount > 0) {
        throw new Error(
            `Không thể xóa — danh mục đang chứa ${productCount} sản phẩm`
        );
    }

    await prisma.category.delete({
        where: { id: Number(id) }
    });

    return true;
};
