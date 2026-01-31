import prisma from "../../config/client.js";
import { slugify } from "../../utils/slugify.js";

export const getProductGroupsServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.productGroup.findMany({
            skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                brand: true,
                category: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        isActive: true
                    }
                }
            }
        }),
        prisma.productGroup.count()
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

    if (!productGroup) throw new Error("Nhóm sản phẩm không tồn tại");
    return productGroup;
};

export const createProductGroupServices = async (data) => {
    const slug = slugify(data.name);

    const existed = await prisma.productGroup.findFirst({
        where: { slug }
    });

    if (existed) {
        throw new Error("Nhóm sản phẩm đã tồn tại");
    }

    return prisma.productGroup.create({
        data: {
            name: data.name,
            slug,
            brandId: Number(data.brandId),
            categoryId: Number(data.categoryId),
        }
    });
};


export const updateProductGroupServices = async (id, data) => {
    const exist = await prisma.productGroup.findUnique({
        where: { id: Number(id) }
    });

    if (!exist) {
        throw new Error("Nhóm sản phẩm không tồn tại");
    }

    const updateData = {};

    if (data.name !== undefined && data.name !== null) {
        const newSlug = slugify(data.name);
        const duplicated = await prisma.productGroup.findFirst({
            where: {
                slug: newSlug,
                NOT: { id: Number(id) }
            }
        });

        if (duplicated) {
            throw new Error("Tên product group đã tồn tại");
        }

        updateData.name = data.name;
        updateData.slug = newSlug;
    }

    if (data.brandId !== undefined && data.brandId !== null) {
        updateData.brandId = Number(data.brandId);
    }

    if (data.categoryId !== undefined && data.categoryId !== null) {
        updateData.categoryId = Number(data.categoryId);
    }

    if (data.isActive !== undefined) {
        updateData.isActive =
            data.isActive === true || data.isActive === "true";
    }


    const result = await prisma.productGroup.update({
        where: { id: Number(id) },
        data: updateData
    });
    return result;
};

export const deleteProductGroupServices = async (id) => {
    id = Number(id);

    const exist = await prisma.productGroup.findUnique({
        where: { id }
    });
    if (!exist) throw new Error("Nhóm sản phẩm không tồn tại");

    const productCount = await prisma.product.count({
        where: { productGroupId: id }
    });

    if (productCount > 0) {
        throw new Error("Không thể xóa product group đang chứa sản phẩm");
    }

    await prisma.productGroup.update({
        where: { id },
        data: { isActive: false }
    });


    return true;
};
