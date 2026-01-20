import {
    createRoleServices,
    getRolesServices,
    getRoleByIdServices,
    updateRoleServices,
    deleteRoleServices,
} from "../../services/admin/role.services.js";

export const getRoles = async (req, res) => {
    try {
        const roles = await getRolesServices(req.validated.query);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy danh sách vai trò thành công",
            data: roles.items,
            pagination: roles.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const getRoleById = async (req, res) => {
    try {
        const role = await getRoleByIdServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Lấy vai trò thành công",
            data: role,
        });
    } catch (error) {
        return res.status(404).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const createRole = async (req, res) => {
    try {
        const role = await createRoleServices(req.validated.body);

        return res.status(201).json({
            ErrorCode: 0,
            message: "Tạo vai trò thành công",
            data: role,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const updateRole = async (req, res) => {
    try {
        const role = await updateRoleServices(
            req.validated.params.id,
            req.validated.body
        );

        return res.status(200).json({
            ErrorCode: 0,
            message: "Cập nhật vai trò thành công",
            data: role,
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};

export const deleteRole = async (req, res) => {
    try {
        await deleteRoleServices(req.validated.params.id);

        return res.status(200).json({
            ErrorCode: 0,
            message: "Xóa vai trò thành công",
        });
    } catch (error) {
        return res.status(400).json({
            ErrorCode: 1,
            message: error.message,
        });
    }
};
