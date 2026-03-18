import {
    getVariantsServices,
    getVariantByIdServices,
    getVariantsByProductIdServices,
    createVariantServices,
    updateVariantServices,
    deleteVariantServices
} from "../../services/admin/variant.services.js";

// ========================
// GET LIST
// ========================

export const getVariants = async (req, res) => {
    try {
        const result = await getVariantsServices(req.validated.query);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách variant thành công",
            data: result.items,
            pagination: result.pagination
        });
    } catch (error) {
        return res.status(500).json({ ErrorCode: 1, message: error.message });
    }
};

// ========================
// GET BY ID
// ========================

export const getVariantById = async (req, res) => {
    try {
        const data = await getVariantByIdServices(req.validated.params.id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy variant thành công",
            data
        });
    } catch (error) {
        return res.status(404).json({ ErrorCode: 1, message: error.message });
    }
};

// ========================
// GET BY PRODUCT ID
// Trả về variants + storages[] + colors[]
// ========================

export const getVariantsByProductId = async (req, res) => {
    try {
        const data = await getVariantsByProductIdServices(req.params.productId);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy variant theo sản phẩm thành công",
            data
        });
    } catch (error) {
        return res.status(404).json({ ErrorCode: 1, message: error.message });
    }
};

// ========================
// CREATE
// ========================

export const createVariant = async (req, res) => {
    try {
        const data = await createVariantServices(req.validated.body);
        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo variant thành công",
            data
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

// ========================
// UPDATE
// ========================

export const updateVariant = async (req, res) => {
    try {
        const data = await updateVariantServices(
            req.validated.params.id,
            req.validated.body
        );
        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật variant thành công",
            data
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

// ========================
// DELETE
// ========================

export const deleteVariant = async (req, res) => {
    try {
        await deleteVariantServices(req.validated.params.id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa variant thành công"
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};