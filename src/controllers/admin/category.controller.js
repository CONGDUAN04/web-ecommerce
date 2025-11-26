import {
    createCategoryServices,
    deleteCategoryServices,
    getCategoryByIdServices,
    getCategoryServices,
    updateCategoryServices
} from "../../services/admin/category.services.js";

export const getCategory = async (req, res) => {
    try {
        const category = await getCategoryServices();

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách danh mục thành công!",
            data: category,
        });

    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: "Lấy danh sách danh mục thất bại!",
            error: error.message,
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await getCategoryByIdServices(id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách danh mục thành công!",
            data: category,
        });

    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: "Lấy danh sách danh mục thất bại!",
            error: error.message,
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const file = req.file;
        const image = file?.filename ?? undefined;

        const category = await updateCategoryServices(id, data, image);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật danh mục thành công!",
            data: category,
        });

    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;
        const image = file?.filename ?? undefined;

        const category = await createCategoryServices(data, image);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo danh mục thành công!",
            data: category,
        });

    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteCategoryServices(id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa danh mục thành công!",
        });

    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};
