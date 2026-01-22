import {
    createStorageServices,
    getStoragesServices,
    getStorageByIdServices,
    updateStorageServices,
    deleteStorageServices,
} from "../../services/admin/storage.services.js";

export const createStorage = async (req, res) => {
    try {
        const result = await createStorageServices(req.validated.body);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo dung lượng sản phẩm thành công",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const getStorages = async (req, res) => {
    try {
        const result = await getStoragesServices(req.validated.query);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách dung lượng thành công",
            data: result.items,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const getStorageById = async (req, res) => {
    try {
        const storage = await getStorageByIdServices(+req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy dung lượng sản phẩm thành công",
            data: storage,
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const updateStorage = async (req, res) => {
    try {
        const storage = await updateStorageServices(
            +req.validated.params.id,
            req.validated.body
        );

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật dung lượng sản phẩm thành công",
            data: storage,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const deleteStorage = async (req, res) => {
    try {
        await deleteStorageServices(+req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa dung lượng sản phẩm thành công",
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};