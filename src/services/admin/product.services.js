import prisma from "../../config/client.js";
import path from "path";
export const createProductService = async (data, files) => {
    const { name, desc, brandId, targetId, categoryId, colors } = data;

    if (!name || !colors) throw new Error("Thiếu tên hoặc màu sản phẩm");

    const colorsData = JSON.parse(colors);

    // Lấy file thumbnail
    const thumbnailFile = files.thumbnail?.[0];
    const thumbnail = thumbnailFile ? path.basename(thumbnailFile.path) : null;

    // Lấy file colorImages theo thứ tự
    const colorFiles = files.colorImages || [];

    // Tính tổng quantity từ tất cả storage variants
    const totalQuantity = colorsData.reduce(
        (sum, c) => sum + c.storages.reduce((s, v) => s + parseInt(v.quantity), 0),
        0
    );

    // Tạo product với các quan hệ brand, target, category
    const product = await prisma.product.create({
        data: {
            name,
            desc,
            thumbnail,
            quantity: totalQuantity,
            sold: 0,
            // Kết nối với Brand (nếu có)
            brandId: brandId ? parseInt(brandId) : null,
            // Kết nối với Target (nếu có)
            targetId: targetId ? parseInt(targetId) : null,
            // Kết nối với Category (nếu có)
            categoryId: categoryId ? parseInt(categoryId) : null,
            // Tạo nested ColorVariant và StorageVariant
            colors: {
                create: colorsData.map((c, index) => ({
                    color: c.color,
                    image: colorFiles[index] ? path.basename(colorFiles[index].path) : null,
                    storages: {
                        create: c.storages.map((s) => ({
                            name: s.name,
                            price: parseInt(s.price),
                            quantity: parseInt(s.quantity),
                            sold: 0,
                        })),
                    },
                })),
            },
        },
        include: {
            brand: true,
            target: true,
            category: true,
            colors: {
                include: {
                    storages: true
                }
            },
        },
    });

    return product;
};
export const getAllProductsService = async () => {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            brand: true,
            target: true,
            colors: {
                include: {
                    storages: true,
                },
            }
        },
    });

    return products;
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
