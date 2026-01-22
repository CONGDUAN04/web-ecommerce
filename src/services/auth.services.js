// services/auth.services.js
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import prisma from "../config/client.js";
import { ACCOUNT_TYPE } from "../config/constant.js";
import jwt from "jsonwebtoken";

export const isEmailExist = async (email) => {
    const count = await prisma.user.count({
        where: { username: email }
    });
    return count > 0;
};

export const registerNewUser = async (data) => {
    const { fullName, username, password } = data;

    // Kiểm tra email đã tồn tại
    const existed = await isEmailExist(username);
    if (existed) {
        throw new Error("Email đã được sử dụng");
    }

    const hashedPassword = await hashPassword(password);

    const userRole = await prisma.role.findUnique({
        where: { name: "User" }
    });

    if (!userRole) throw new Error("User Role không tồn tại");

    return prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            fullName,
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: userRole.id
        },
        select: {
            id: true,
            username: true,
            fullName: true,
            createdAt: true,
        }
    });
};

export const handleLogin = async (username, password) => {
    const user = await prisma.user.findUnique({
        where: { username },
        include: { role: true },
    });

    if (!user) {
        throw new Error("Tài khoản không tồn tại");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu không chính xác");
    }

    const payload = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        accountType: user.accountType,
    };

    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const access_token = jwt.sign(payload, secret, { expiresIn });

    return access_token;
};

export const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            fullName: true,
            phone: true,
            avatar: true,
            roleId: true,
            role: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error("Người dùng không tồn tại");
    }

    return user;
};

export const updateUserProfile = async (userId, data) => {
    const { fullName, address, phone, avatar } = data;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("Người dùng không tồn tại");
    }

    return prisma.user.update({
        where: { id: userId },
        data: {
            fullName: fullName ?? user.fullName,
            address: address ?? user.address,
            phone: phone ?? user.phone,
            avatar: avatar ?? user.avatar,
        },
        select: {
            id: true,
            username: true,
            fullName: true,
            phone: true,
            address: true,
            avatar: true,
        }
    });
};

export const changeUserPassword = async (userId, data) => {
    const { oldPassword, newPassword } = data;

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error("Người dùng không tồn tại");
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu cũ không đúng");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });

    return true;
};