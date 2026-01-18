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
    // Check tên danh mục đã tồn tại
    const existed = await prisma.category.findFirst({
        where: { name: data.name }
    });
    if (existed) throw new Error("Danh mục đã tồn tại");

    return prisma.category.create({
        data: {
            name: data.name,
            description: data.description || "",
            image: data.image || null,
        }
    });
};

export const updateCategoryServices = async (id, data, image) => {
    // Check category tồn tại
    const exist = await prisma.category.findUnique({
        where: { id: Number(id) }
    });
    if (!exist) throw new Error("Danh mục không tồn tại");

    // Check tên trùng (nếu có update name)
    if (data.name) {
        const duplicated = await prisma.category.findFirst({
            where: {
                name: data.name,
                NOT: { id: Number(id) }
            }
        });
        if (duplicated) throw new Error("Tên danh mục đã tồn tại");
    }

    // Prepare update data
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (image) updateData.image = image;

    return prisma.category.update({
        where: { id: Number(id) },
        data: updateData
    });
};

export const deleteCategoryServices = async (id) => {
    const exist = await prisma.category.findUnique({
        where: { id: Number(id) }
    });
    if (!exist) throw new Error("Danh mục không tồn tại");

    await prisma.category.delete({
        where: { id: Number(id) }
    });

    return true;
};