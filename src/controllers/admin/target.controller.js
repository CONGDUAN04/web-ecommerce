// controllers/admin/target.controller.js
import {
    createTargetServices,
    getTargetByIdServices,
    getTargetServices,
    updateTargetServices,
    deleteTargetServices
} from "../../services/admin/target.services.js";

// Lấy danh sách tất cả mục tiêu
export const getTarget = async (req, res) => {
    try {
        const targets = await getTargetServices();
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách mục tiêu thành công",
            data: targets
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

// Lấy mục tiêu theo ID
export const getTargetById = async (req, res) => {
    try {
        const { id } = req.params;
        const target = await getTargetByIdServices(id);

        if (!target) {
            return res.status(404).json({
                ErrorCode: 1,
                message: "Mục tiêu không tồn tại"
            });
        }

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy mục tiêu thành công",
            data: target
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

// Tạo mục tiêu mới
export const createTarget = async (req, res) => {
    try {
        const data = req.body;
        const target = await createTargetServices(data);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo mục tiêu thành công",
            data: target
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

// Cập nhật mục tiêu theo ID
export const updateTarget = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const target = await updateTargetServices(id, data);

        if (!target) {
            return res.status(404).json({
                ErrorCode: 1,
                message: "Mục tiêu không tồn tại"
            });
        }

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật mục tiêu thành công",
            data: target
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

// Xóa mục tiêu theo ID
export const deleteTarget = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteTargetServices(id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa mục tiêu thành công"
        });
    } catch (error) {
        if (error.message === "Mục tiêu không tồn tại") {
            return res.status(404).json({
                ErrorCode: 1,
                message: error.message
            });
        }
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};
