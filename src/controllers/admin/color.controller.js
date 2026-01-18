import {
    createColorServices,
    getColorsServices,
    getColorByIdServices,
    updateColorServices,
    deleteColorServices,
} from "../../services/admin/color.services.js";

export const getColors = async (req, res) => {
    try {
        const result = await getColorsServices(req.validated.query);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách màu sản phẩm thành công",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const getColorById = async (req, res) => {
    try {
        const color = await getColorByIdServices(req.validated.params.id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy màu sản phẩm thành công",
            data: color,
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const createColor = async (req, res) => {
    try {
        const image = req.file?.filename;

        const color = await createColorServices({
            ...req.validated.body,
            image,
        });

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo màu sản phẩm thành công",
            data: color,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const updateColor = async (req, res) => {
    try {
        const image = req.file?.filename;

        const color = await updateColorServices(
            req.validated.params.id,
            {
                ...req.validated.body,
                image,
            }
        );

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật màu sản phẩm thành công",
            data: color,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const deleteColor = async (req, res) => {
    try {
        await deleteColorServices(req.validated.params.id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa màu sản phẩm thành công",
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};
