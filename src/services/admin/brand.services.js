import prisma from "../../config/client.js";

export const getBrandsServices = async ({ page = 1, limit = 10 }) => {
    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.brand.findMany({
            skip,
            take: limit,
            orderBy: { id: "desc" },
        }),
        prisma.brand.count(),
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

export const getBrandByIdServices = async (id) => {
    const brand = await prisma.brand.findUnique({
        where: { id: Number(id) },
    });

    if (!brand) throw new Error("Thương hiệu không tồn tại");
    return brand;
};

export const createBrandServices = async (data, imageBrand) => {
    const existingBrand = await prisma.brand.findFirst({
        where: {
            name: data.name,
        },
    });
    if (existingBrand) {
        throw new Error("Tên thương hiệu đã tồn tại");
    }
    return prisma.brand.create({
        data: {
            name: data.name,
            imageBrand,
        },
    });
};

export const updateBrandServices = async (id, data, imageBrand) => {
    const brand = await prisma.brand.findUnique({
        where: { id: Number(id) },
    });
    if (!brand) throw new Error("Thương hiệu không tồn tại");

    if (data.name) {
        const duplicated = await prisma.brand.findFirst({
            where: {
                name: data.name,
                NOT: { id: Number(id) },
            },
        });
        if (duplicated) throw new Error("Tên thương hiệu đã tồn tại");
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (imageBrand) updateData.imageBrand = imageBrand;

    return prisma.brand.update({
        where: { id: Number(id) },
        data: updateData,
    });
};

export const deleteBrandServices = async (id) => {
    const brand = await prisma.brand.findUnique({
        where: { id: Number(id) },
    });
    if (!brand) throw new Error("Thương hiệu không tồn tại");

    await prisma.brand.delete({
        where: { id: Number(id) },
    });

    return true;
};