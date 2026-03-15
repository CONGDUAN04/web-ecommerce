import {
    getUsersServices,
    getUserByIdServices,
    createUserServices,
    updateUserServices,
    deleteUserServices
} from "../../services/admin/user.services.js";

export const getUsers = async (req, res) => {
    try {
        const result = await getUsersServices(req.validated.query);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách người dùng thành công",
            data: result.items,
            pagination: result.pagination
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await getUserByIdServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy thông tin người dùng thành công",
            data: user
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const user = await createUserServices(
            req.validated.body,
            req.file?.filename
        );

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo người dùng thành công",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await updateUserServices(
            req.validated.params.id,
            req.validated.body,
            req.file?.filename
        );

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật người dùng thành công",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await deleteUserServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa người dùng thành công"
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};