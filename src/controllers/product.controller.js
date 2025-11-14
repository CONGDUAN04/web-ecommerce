import {
    getAllProductsServices,
    postCreateProductServices,
    putUpdateProductsServices,
    deleteProductServices
} from "../services/product.services.js";

export const postCreateProduct = async (req, res) => {
    try {
        const data = req.body;
        const product = await postCreateProductServices(data);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Tạo sản phẩm thành công!",
            data: product
        });

    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await getAllProductsServices();

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách sản phẩm thành công!",
            data: products
        });

    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: "Lấy danh sách sản phẩm thất bại."
        });
    }
};

export const putUpdateProduct = async (req, res) => {
    try {
        const data = req.body;
        const product = await putUpdateProductsServices(data);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật sản phẩm thành công!",
            data: product
        });

    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const id = req.body.productId;
        await deleteProductServices(id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xoá sản phẩm thành công!"
        });

    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};
