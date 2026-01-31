import {
    getColorsServices,
    createColorServices,
    updateColorServices,
    deleteColorServices
} from "../../services/admin/color.services.js";

export const getColors = async (req, res) => {
    try {
        const colors = await getColorsServices(req.validated.query);

        res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách màu thành công",
            data: colors
        });
    } catch (error) {
        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const createColor = async (req, res) => {
    try {
        const color = await createColorServices({
            ...req.validated.body,
            image: req.file?.filename
        });

        res.status(201).json({
            ErrorCode: 0,
            message: "Tạo màu thành công",
            data: color
        });
    } catch (error) {
        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const updateColor = async (req, res) => {
    try {
        const color = await updateColorServices(
            req.validated.params.id,
            req.validated.body,
            req.file?.filename);

        res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật màu thành công",
            data: color
        });
    } catch (error) {
        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const deleteColor = async (req, res) => {
    try {
        await deleteColorServices(req.validated.params.id);

        res.status(200).json({
            ErrorCode: 0,
            message: "Xóa màu thành công"
        });
    } catch (error) {
        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};
