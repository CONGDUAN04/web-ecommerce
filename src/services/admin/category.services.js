export const getCategoryServices = async () => {
    return await prisma.category.findMany({
        orderBy: { id: "desc" },
    });
};

export const getCategoryByIdServices = async (id) => {
    return await prisma.category.findUnique({
        where: { id: +id }
    });
};

export const updateCategoryServices = async (id, data, image) => {
    try {
        const payload = {
            ...(data.name && { name: data.name }),
            ...(data.description && { description: data.description }),
            ...(image && { image }),
        };

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: payload,
        });

        return category;

    } catch (error) {
        console.log(error);
        throw new Error(error.message || "Cập nhật danh mục thất bại");
    }
};

export const createCategoryServices = async (data, image) => {
    try {
        const payload = {
            name: data.name,
            description: data.description,
            ...(image && { image }),
        };

        const category = await prisma.category.create({
            data: payload,
        });

        return category;

    } catch (error) {
        console.log(error);
        throw new Error(error.message || "Tạo danh mục thất bại");
    }
};

export const deleteCategoryServices = async (id) => {
    try {
        const existCategory = await prisma.category.findUnique({
            where: { id: Number(id) },
        });

        if (!existCategory) throw new Error("Danh mục không tồn tại");

        await prisma.category.delete({
            where: { id: Number(id) },
        });

        return true;

    } catch (error) {
        console.log(error);
        throw new Error(error.message || "Xóa danh mục thất bại");
    }
};
