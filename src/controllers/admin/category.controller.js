import {
    getCategoriesServices,
    getCategoryByIdServices,
    updateCategoryServices,
    deleteCategoryServices,
    createCategoryServices,
    getCategoryTreeServices
} from "../../services/admin/category.services.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await getCategoriesServices(req.validated.query);
        res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách danh mục thành công",
            data: categories.items,
            pagination: categories.pagination
        });

    } catch (error) {

        res.status(500).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {

        const category = await getCategoryByIdServices(req.validated.params.id);

        res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh mục thành công",
            data: category
        });

    } catch (error) {

        res.status(404).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const createCategory = async (req, res) => {
    try {

        const category = await createCategoryServices({
            ...req.validated.body,
            image: req.file?.filename || null
        });

        res.status(201).json({
            ErrorCode: 0,
            message: "Tạo danh mục thành công",
            data: category
        });

    } catch (error) {

        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const updateCategory = async (req, res) => {
    try {

        const payload = {
            ...req.validated.body
        };

        if (req.file) {
            payload.image = req.file.filename;
        }

        const category = await updateCategoryServices(
            req.validated.params.id,
            payload
        );

        res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật danh mục thành công",
            data: category
        });

    } catch (error) {

        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {

        await deleteCategoryServices(req.validated.params.id);

        res.status(200).json({
            ErrorCode: 0,
            message: "Xóa danh mục thành công"
        });

    } catch (error) {

        res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getCategoryTree = async (req, res) => {
    try {

        const tree = await getCategoryTreeServices();

        res.status(200).json({
            ErrorCode: 0,
            data: tree
        });

    } catch (error) {

        res.status(500).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};