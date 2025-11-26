import prisma from "../../config/client.js";

export const createBrandServices = async (data) => {
    const existBrand = await prisma.brand.findFirst({
        where: { name: data.name }
    });

    if (existBrand) {
        throw new Error("Tên thương hiệu đã tồn tại");
    }

    const brand = await prisma.brand.create({
        data: {
            name: data.name,
            imageBrand: data.imageBrand,
        }
    });

    return brand;
};

export const getAllBrandsServices = async () => {
    try {
        return await prisma.brand.findMany();
    } catch (error) {
        throw new Error(error.message || "Lấy danh sách thương hiệu thất bại");
    }
};

export const getBrandByIdServices = async (id) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id: Number(id) },
        });

        if (!brand) throw new Error("Thương hiệu không tồn tại");

        return brand;
    } catch (error) {
        throw new Error(error.message || "Lấy thương hiệu thất bại");
    }
};

export const updateBrandServices = async (id, data, imageBrand) => {
    try {
        const existBrand = await prisma.brand.findUnique({
            where: { id: Number(id) },
        });

        if (!existBrand) throw new Error("Thương hiệu không tồn tại");

        if (data.name) {
            const duplicated = await prisma.brand.findFirst({
                where: {
                    name: data.name,
                    NOT: { id: Number(id) }
                }
            });
            if (duplicated) throw new Error("Tên thương hiệu đã tồn tại");
        }

        const brand = await prisma.brand.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                ...(imageBrand && { imageBrand }),
            },
        });

        return brand;
    } catch (error) {
        throw new Error(error.message || "Cập nhật thương hiệu thất bại");
    }
};

export const deleteBrandServices = async (id) => {
    try {
        const existBrand = await prisma.brand.findUnique({
            where: { id: Number(id) },
        });

        if (!existBrand) throw new Error("Thương hiệu không tồn tại");

        await prisma.brand.delete({
            where: { id: Number(id) },
        });

        return true;
    } catch (error) {
        throw new Error(error.message || "Xóa thương hiệu thất bại");
    }
};
