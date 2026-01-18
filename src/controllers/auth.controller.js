// controllers/auth.controller.js
import {
    registerNewUser,
    handleLogin,
    getUserById,
    updateUserProfile,
    changeUserPassword,
} from "../services/auth.services.js";

export const register = async (req, res) => {
    try {
        const user = await registerNewUser(req.body);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Đăng ký thành công",
            data: user,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const access_token = await handleLogin(username, password);

        return res.status(200).json({
            ErrorCode: 0,
            message: `Chào mừng ${username} đến với hệ thống`,
            data: { access_token },
        });
    } catch (error) {
        return res.status(401).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const fetchAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy thông tin tài khoản thành công",
            data: { user },
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const avatar = req.file?.filename
            ? `/avatars/${req.file.filename}`
            : undefined;

        const user = await updateUserProfile(userId, {
            ...req.body,
            avatar,
        });

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật thông tin thành công",
            data: user,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        await changeUserPassword(userId, req.body);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Đổi mật khẩu thành công",
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.status(200).json({
            ErrorCode: 0,
            message: "Đăng xuất thành công",
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};