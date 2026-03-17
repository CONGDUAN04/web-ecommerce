import {
    getProductGroupsServices,
    getProductGroupByIdServices,
    createProductGroupServices,
    updateProductGroupServices,
    deleteProductGroupServices
} from "../../services/admin/productGroup.services.js";

export const getProductGroups = async (req, res) => {
    try {
        const result = await getProductGroupsServices(req.validated.query);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách product group thành công",
            data: result.items,
            pagination: result.pagination
        });
    } catch (error) {
        return res.status(500).json({ ErrorCode: 1, message: error.message });
    }
};

export const getProductGroupById = async (req, res) => {
    try {
        const data = await getProductGroupByIdServices(req.validated.params.id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy product group thành công",
            data
        });
    } catch (error) {
        return res.status(404).json({ ErrorCode: 1, message: error.message });
    }
};

export const createProductGroup = async (req, res) => {
    try {
        const data = await createProductGroupServices(req.validated.body);
        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo product group thành công",
            data
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

export const updateProductGroup = async (req, res) => {
    try {
        const data = await updateProductGroupServices(
            req.validated.params.id,
            req.validated.body
        );
        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật product group thành công",
            data
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};

export const deleteProductGroup = async (req, res) => {
    try {
        await deleteProductGroupServices(req.validated.params.id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa product group thành công"
        });
    } catch (error) {
        return res.status(400).json({ ErrorCode: 1, message: error.message });
    }
};