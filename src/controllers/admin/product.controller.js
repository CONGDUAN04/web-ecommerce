import {
    getAllProductsServices,
    postCreateProductServices,
    putUpdateProductsServices,
    deleteProductServices,
    getProductByIdServices
} from "../../services/admin/product.services.js";

export const postCreateProduct = async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;
        const image = file?.filename ?? undefined;
        const product = await postCreateProductServices(data, image);

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
        const data = {
            id: req.params.id, // Đưa id vào data
            ...req.body
        };
        const file = req.file;
        const image = file?.filename ?? undefined;
        const product = await putUpdateProductsServices(data, image);
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
        const id = req.params.id
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

export const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await getProductByIdServices(id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy sản phẩm thành công!",
            data: product
        });

    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};
