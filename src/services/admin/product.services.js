import prisma from "../../config/client.js";
export const postCreateProductServices = async (data, image) => {
    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                price: +data.price,
                image: image,
                detailDesc: data.detailDesc,
                shortDesc: data.shortDesc,
                quantity: +data.quantity,
                sold: 0,
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
export const putUpdateProductsServices = async (data, image) => {
    try {
        const { id, ...updateData } = data;
        if (updateData.price !== undefined) updateData.price = +updateData.price;
        if (updateData.quantity !== undefined) updateData.quantity = +updateData.quantity;
        if (updateData.categoryId !== undefined) {
            updateData.categoryId = updateData.categoryId ? +updateData.categoryId : null;
        }
        if (image !== undefined) {
            updateData.image = image;
        }
        const product = await prisma.product.update({
            where: { id: +id },
            data: updateData,
        });
        return product;
    } catch (error) {
        console.log('Error in putUpdateProductsServices:', error);
        throw new Error(error.message || "Cập nhật sản phẩm thất bại.");
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
export const getProductByIdServices = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id: +id }
    });
    if (!product) {
        throw new Error("Sản phẩm không tồn tại.");
    }
    return product;
};
