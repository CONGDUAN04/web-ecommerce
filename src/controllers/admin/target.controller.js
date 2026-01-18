import {
    createTargetServices,
    getTargetsServices,
    getTargetByIdServices,
    updateTargetServices,
    deleteTargetServices,
} from "../../services/admin/target.services.js";

export const getTargets = async (req, res) => {
    try {
        const result = await getTargetsServices(req.validated.query);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách mục tiêu thành công",
            data: result.items,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const getTargetById = async (req, res) => {
    try {
        const target = await getTargetByIdServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy mục tiêu thành công",
            data: target,
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const createTarget = async (req, res) => {
    try {
        const target = await createTargetServices(req.validated.body);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo mục tiêu thành công",
            data: target,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const updateTarget = async (req, res) => {
    try {
        const target = await updateTargetServices(
            req.validated.params.id,
            req.validated.body
        );

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật mục tiêu thành công",
            data: target,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const deleteTarget = async (req, res) => {
    try {
        await deleteTargetServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa mục tiêu thành công",
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};
