import prisma from "../../config/client.js";

export const getCategoriesServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.category.findMany({
            skip,
            take: limit,
            orderBy: { id: "desc" }
        }),
        prisma.category.count()
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

export const getCategoryByIdServices = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id: Number(id) }
    });

    if (!category) throw new Error("Danh mục không tồn tại");
    return category;
};

export const createCategoryServices = async (data) => {
    const existed = await prisma.category.findFirst({
        where: { name: data.name }
    });

    if (existed) throw new Error("Danh mục đã tồn tại");

    // check parent
    if (data.parentId) {
        const parent = await prisma.category.findUnique({
            where: { id: data.parentId }
        });

        if (!parent) throw new Error("Danh mục cha không tồn tại");
    }

    return prisma.category.create({
        data: {
            name: data.name,
            description: data.description || "",
            image: data.image || null,
            parentId: data.parentId || null
        }
    });
};

export const updateCategoryServices = async (id, data) => {
    id = Number(id);

    const exist = await prisma.category.findUnique({
        where: { id }
    });

    if (!exist) throw new Error("Danh mục không tồn tại");

    if (data.name) {
        const duplicated = await prisma.category.findFirst({
            where: {
                name: data.name,
                NOT: { id }
            }
        });

        if (duplicated) throw new Error("Tên danh mục đã tồn tại");
    }

    if (data.parentId !== undefined && data.parentId !== null) {
        if (data.parentId === id)
            throw new Error("Danh mục không thể làm cha của chính nó");

        const parent = await prisma.category.findUnique({
            where: { id: data.parentId }
        });

        if (!parent) throw new Error("Danh mục cha không tồn tại");
    }

    return prisma.category.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.image && { image: data.image }),
            ...(data.parentId !== undefined && { parentId: data.parentId }),
        }
    });
};
export const deleteCategoryServices = async (id) => {
    id = Number(id);

    // 1. Check tồn tại
    const exist = await prisma.category.findUnique({
        where: { id }
    });

    if (!exist) throw new Error("Danh mục không tồn tại");

    // 2. Check còn danh mục con
    const childrenCount = await prisma.category.count({
        where: { parentId: id }
    });

    if (childrenCount > 0) {
        throw new Error("Danh mục còn danh mục con, không thể xóa");
    }

    // 3. Check còn product group
    const used = await prisma.productGroup.count({
        where: { categoryId: id }
    });

    if (used > 0) {
        throw new Error("Danh mục đang chứa sản phẩm, không thể xóa");
    }

    // 4. Delete
    await prisma.category.delete({
        where: { id }
    });

    return true;
};

export const getCategoryTreeServices = async () => {
    return prisma.category.findMany({
        where: { parentId: null },
        include: {
            children: {
                include: {
                    children: true
                }
            }
        },
        orderBy: { id: "asc" }
    });
};
