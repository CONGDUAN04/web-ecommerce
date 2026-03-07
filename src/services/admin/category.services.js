import prisma from "../../config/client.js";

export const getCategoriesServices = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        prisma.category.findMany({
            skip,
            take: limit,
            orderBy: { id: "desc" },
            include: {
                parent: true
            }
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
        where: { id: Number(id) },
        include: {
            parent: true,
            children: true
        }
    });

    if (!category) {
        throw new Error("Danh mục không tồn tại");
    }

    return category;
};

export const createCategoryServices = async (data) => {

    const existed = await prisma.category.findUnique({
        where: { name: data.name }
    });

    if (existed) {
        throw new Error("Danh mục đã tồn tại");
    }

    if (data.parentId) {

        const parent = await prisma.category.findUnique({
            where: { id: Number(data.parentId) }
        });

        if (!parent) {
            throw new Error("Danh mục cha không tồn tại");
        }
    }

    return prisma.category.create({
        data: {
            name: data.name,
            description: data.description ?? null,
            image: data.image ?? null,
            parentId: data.parentId ?? null
        }
    });
};

export const updateCategoryServices = async (id, data) => {

    id = Number(id);

    const exist = await prisma.category.findUnique({
        where: { id }
    });

    if (!exist) {
        throw new Error("Danh mục không tồn tại");
    }

    if (data.name) {

        const duplicated = await prisma.category.findFirst({
            where: {
                name: data.name,
                NOT: { id }
            }
        });

        if (duplicated) {
            throw new Error("Tên danh mục đã tồn tại");
        }
    }

    if (data.parentId !== undefined) {

        if (data.parentId === id) {
            throw new Error("Danh mục không thể làm cha của chính nó");
        }

        if (data.parentId !== null) {

            const parent = await prisma.category.findUnique({
                where: { id: Number(data.parentId) }
            });

            if (!parent) {
                throw new Error("Danh mục cha không tồn tại");
            }
        }
    }

    return prisma.category.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.image !== undefined && { image: data.image }),
            ...(data.parentId !== undefined && { parentId: data.parentId })
        }
    });
};

export const deleteCategoryServices = async (id) => {

    id = Number(id);

    const exist = await prisma.category.findUnique({
        where: { id }
    });

    if (!exist) {
        throw new Error("Danh mục không tồn tại");
    }

    const childrenCount = await prisma.category.count({
        where: { parentId: id }
    });

    if (childrenCount > 0) {
        throw new Error("Danh mục còn danh mục con, không thể xóa");
    }

    const used = await prisma.productGroup.count({
        where: { categoryId: id }
    });

    if (used > 0) {
        throw new Error("Danh mục đang chứa sản phẩm, không thể xóa");
    }

    await prisma.category.delete({
        where: { id }
    });

    return true;
};

export const getCategoryTreeServices = async () => {

    const categories = await prisma.category.findMany({
        orderBy: { id: "asc" }
    });

    const map = {};
    const tree = [];

    categories.forEach(cat => {
        map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {

        if (cat.parentId) {
            map[cat.parentId]?.children.push(map[cat.id]);
        } else {
            tree.push(map[cat.id]);
        }

    });

    return tree;
};