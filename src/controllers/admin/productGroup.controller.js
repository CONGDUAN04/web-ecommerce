import {
    getProductGroupsServices,
    getProductGroupByIdServices,
    createProductGroupServices,
    updateProductGroupServices,
    deleteProductGroupServices
} from "../../services/admin/productGroup.services.js";

export const getProductGroups = async (req, res) => {
    try {
        const productGroups = await getProductGroupsServices(req.validated.query);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách nhóm sản phẩm thành công",
            data: productGroups.items,
            pagination: productGroups.pagination
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getProductGroupById = async (req, res) => {
    try {
        const productGroup = await getProductGroupByIdServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy nhóm sản phẩm thành công",
            data: productGroup
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const createProductGroup = async (req, res) => {
    try {
        const productGroup = await createProductGroupServices(req.validated.body);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo nhóm sản phẩm thành công",
            data: productGroup
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const updateProductGroup = async (req, res) => {
    try {
        const { id } = req.validated.params;
        const data = req.validated.body;
        const result = await updateProductGroupServices(id, data);
        res.status(200).json({
            data: result,
            message: "Cập nhật nhóm sản phẩm thành công"
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            message: error.message
        });
    }
};

export const deleteProductGroup = async (req, res) => {
    try {
        await deleteProductGroupServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa nhóm sản phẩm thành công"
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};
