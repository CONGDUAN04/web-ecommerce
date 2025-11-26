import { postCreateUserServices, getAllUsersService, putUpdateUserServices, deleteUserServices, getUserByIdServices } from "../../services/admin/user.services.js";
export const postCreateUser = async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;
        const avatar = file?.filename ?? undefined;
        const user = await postCreateUserServices(data, avatar);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Tạo người dùng thành công!",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const products = await getAllUsersService();

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách người dùng thành công!",
            data: products
        });

    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: "Lấy danh sách người dùng thất bại."
        });
    }
};

export const putUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const file = req.file;
        const avatar = file?.filename ?? undefined;
        const product = await putUpdateUserServices(id, data, avatar);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật người dùng thành công!",
            data: product
        });

    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const id = req.params.id
        await deleteUserServices(id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Xoá người dùng thành công!"
        });

    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserByIdServices(id);
        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy thông tin người dùng thành công!",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message
        });
    }
};
