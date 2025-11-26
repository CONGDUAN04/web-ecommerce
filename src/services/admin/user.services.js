// services/userService.js
import prisma from "../../config/client.js";
import { ACCOUNT_TYPE } from "../../config/constant.js";
import { hashPassword } from "../../utils/utils.password.js";
export const postCreateUserServices = async (data, avatar) => {
    try {
        if (!data.fullName || data.fullName.trim() === "") {
            throw new Error("fullName là bắt buộc.");
        }
        if (!data.username || data.username.trim() === "") {
            throw new Error("username là bắt buộc.");
        }
        const existUser = await prisma.user.findUnique({
            where: { username: data.username }
        });

        if (existUser) {
            throw new Error("Username đã tồn tại.");
        }
        const password = await hashPassword("123456");

        const user = await prisma.user.create({
            data: {
                fullName: data.fullName,
                username: data.username,
                password: password,
                address: data.address,
                phone: data.phone,
                accountType: ACCOUNT_TYPE.SYSTEM,
                avatar: avatar,
                roleId: +data.role
            }
        });

        return user;

    } catch (error) {
        console.log(error);
        throw new Error(error.message || "Tạo người dùng thất bại.");
    }
};
export const getAllUsersService = async () => {
    return await prisma.user.findMany({
        include: {
            role: true,
        },
    });
};
export const putUpdateUserServices = async (id, data, avatar) => {
    try {
        const product = await prisma.user.update({
            where: { id: +id },
            data: {
                fullName: data.fullName,
                address: data.address,
                phone: data.phone,
                ...(avatar && { avatar }),
            },

        });
        return product;
    } catch (error) {
        console.log(error)
        throw new Error("Cập nhập người dùng thất bại");
    }
};
export const deleteUserServices = async (id) => {
    try {
        await prisma.user.delete({
            where: { id: +id }
        });
        return true;
    } catch (error) {
        throw new Error("Xoá người dùng thất bại.");
    }
};
export const getUserByIdServices = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id: +id }
    });
    if (!user) {
        throw new Error("Người dùng không tồn tại.");
    }
    return user;
};
