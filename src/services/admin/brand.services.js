import prisma from "../../config/client.js";

export const getBrandsServices = async ({ page = 1, limit = 10 }) => {

    page = Math.max(1, Number(page));
    limit = Math.min(Math.max(1, Number(limit)), 100);

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.brand.findMany({
            skip,
            take: limit,
            orderBy: { id: "desc" }
        }),
        prisma.brand.count()
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

export const getBrandByIdServices = async (id) => {

    const brand = await prisma.brand.findUnique({
        where: { id: Number(id) }
    });

    if (!brand) {
        throw new Error("Thương hiệu không tồn tại");
    }

    return brand;
};

export const createBrandServices = async (data) => {

    const existed = await prisma.brand.findUnique({
        where: { name: data.name }
    });

    if (existed) {
        throw new Error("Tên thương hiệu đã tồn tại");
    }

    return prisma.brand.create({
        data: {
            name: data.name,
            image: data.image ?? null
        }
    });
};

export const updateBrandServices = async (id, data) => {

    id = Number(id);

    const brand = await prisma.brand.findUnique({
        where: { id }
    });

    if (!brand) {
        throw new Error("Thương hiệu không tồn tại");
    }

    if (data.name) {

        const duplicated = await prisma.brand.findFirst({
            where: {
                name: data.name,
                NOT: { id }
            }
        });

        if (duplicated) {
            throw new Error("Tên thương hiệu đã tồn tại");
        }
    }

    return prisma.brand.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.image !== undefined && { image: data.image })
        }
    });
};

export const deleteBrandServices = async (id) => {

    id = Number(id);

    const brand = await prisma.brand.findUnique({
        where: { id }
    });

    if (!brand) {
        throw new Error("Thương hiệu không tồn tại");
    }

    const used = await prisma.productGroup.count({
        where: { brandId: id }
    });

    if (used > 0) {
        throw new Error("Thương hiệu đang được sử dụng, không thể xóa");
    }

    await prisma.brand.delete({
        where: { id }
    });

    return true;
};