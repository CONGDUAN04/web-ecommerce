import {
    getProductsServices,
    getProductByIdServices,
    getProductBySlugServices,
    createProductServices,
    updateProductServices,
    deleteProductServices
} from "../../services/admin/product.services.js";

export const getProducts = async (req, res) => {
    try {
        const result = await getProductsServices(req.validated.query);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách sản phẩm thành công",
            data: result.items,
            pagination: result.pagination
        });
    } catch (error) {
        return res.status(500).json({ ErrorCode: 1, message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const data = await getProductByIdServices(req.validated.params.id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy sản phẩm thành công",
            data
        });
    } catch (error) {
        return res.status(404).json({ ErrorCode: 1, message: error.message });
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const data = await getProductBySlugServices(req.params.slug);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy sản phẩm thành công",
            data
        });
    } catch (error) {
        return res.status(404).json({ ErrorCode: 1, message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const data = await createProductServices(req.validated.body, req.file?.filename);
        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo sản phẩm thành công",
            data
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const data = await updateProductServices(
            req.validated.params.id,
            req.validated.body,
            req.file?.filename
        );
        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật sản phẩm thành công",
            data
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await deleteProductServices(req.validated.params.id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa sản phẩm thành công"
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};