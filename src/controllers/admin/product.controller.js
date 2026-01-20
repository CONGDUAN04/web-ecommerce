import {
    createProductServices,
    getProductsServices,
    getProductByIdServices,
    updateProductServices,
    deleteProductServices,
} from "../../services/admin/product.services.js";

export const createProduct = async (req, res) => {
    try {
        const thumbnail = req.file?.filename;

        const product = await createProductServices({
            ...req.validated.body,
            thumbnail,
        });

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo sản phẩm thành công",
            data: product,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await getProductsServices(req.validated.query);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách sản phẩm thành công",
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy sản phẩm thành công",
            data: product,
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await updateProductServices(
            req.validated.params.id,
            req.validated.body,
            req.file?.filename
        );

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật sản phẩm thành công",
            data: product,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const result = await deleteProductServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: result.message,
            type: result.type,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};