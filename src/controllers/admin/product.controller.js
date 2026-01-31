import {
    getProductsServices,
    getProductByIdServices,
    createProductServices,
    updateProductServices,
    deleteProductServices
} from "../../services/admin/product.services.js";

/**
 * GET /admin/products
 */
export const getProducts = async (req, res) => {
    try {
        const products = await getProductsServices(req.validated.query);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách sản phẩm thành công",
            data: products.items,
            pagination: products.pagination
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

/**
 * GET /admin/products/:id
 */
export const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy sản phẩm thành công",
            data: product
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

/**
 * POST /admin/products
 */
export const createProduct = async (req, res) => {
    try {
        const product = await createProductServices({
            ...req.validated.body,
            thumbnail: req.file?.filename || null
        });

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo sản phẩm thành công",
            data: product
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

/**
 * PUT /admin/products/:id
 */
export const updateProduct = async (req, res) => {
    try {
        console.log("RAW BODY:", req.body);
        console.log("VALIDATED BODY:", req.validated.body);
        const product = await updateProductServices(
            req.validated.params.id,
            req.validated.body,
            req.file?.filename
        );

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật sản phẩm thành công",
            data: product
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

/**
 * DELETE /admin/products/:id
 */
export const deleteProduct = async (req, res) => {
    try {
        await deleteProductServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa sản phẩm thành công"
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};
