import prisma from "../config/client.js"

export const postCreateProductServices = async (data) => {
    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                price: +data.price,
                detailDesc: data.detailDesc,
                shortDesc: data.shortDesc,
                quantity: +data.quantity,
                factory: data.factory,
                target: data.target,
                categoryId: data.categoryId ? +data.categoryId : null
            }
        });
        return product;
    } catch (error) {
        throw new Error("Tạo sản phẩm thất bại.");
    }
};

export const getAllProductsServices = async () => {
    return await prisma.product.findMany();
};

export const putUpdateProductsServices = async (data) => {
    try {
        const { id, ...updateData } = data;

        if (updateData.price) updateData.price = +updateData.price;
        if (updateData.quantity) updateData.quantity = +updateData.quantity;
        if (updateData.categoryId) updateData.categoryId = +updateData.categoryId;

        const product = await prisma.product.update({
            where: { id: +id },
            data: updateData,
        });

        return product;
    } catch (error) {
        throw new Error("Cập nhật sản phẩm thất bại.");
    }
};

export const deleteProductServices = async (id) => {
    try {
        await prisma.product.delete({
            where: { id: +id }
        });
        return true;
    } catch (error) {
        throw new Error("Xoá sản phẩm thất bại.");
    }
};
