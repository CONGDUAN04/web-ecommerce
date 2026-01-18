import { z } from "zod";
export const registerSchema = z.object({
    body: z.object({
        fullName: z
            .string()
            .min(1, "Họ tên không được để trống")
            .max(255, "Họ tên tối đa 255 ký tự")
            .trim(),

        username: z
            .string()
            .email("Email không hợp lệ")
            .min(1, "Email không được để trống")
            .trim(),

        password: z
            .string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .max(100, "Mật khẩu tối đa 100 ký tự"),

        confirmPassword: z
            .string()
            .min(1, "Xác nhận mật khẩu không được để trống"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu và xác nhận mật khẩu không khớp",
        path: ["confirmPassword"],
    }),
});

// Schema đăng nhập
export const loginSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(1, "Username không được để trống")
            .trim(),

        password: z
            .string()
            .min(1, "Mật khẩu không được để trống"),
    }),
});

// Schema đổi mật khẩu
export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z
            .string()
            .min(1, "Mật khẩu cũ không được để trống"),

        newPassword: z
            .string()
            .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
            .max(100, "Mật khẩu mới tối đa 100 ký tự"),

        confirmNewPassword: z
            .string()
            .min(1, "Xác nhận mật khẩu mới không được để trống"),
    }).refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        path: ["confirmNewPassword"],
    }),
});

// Schema cập nhật profile
export const updateProfileSchema = z.object({
    body: z.object({
        fullName: z
            .string()
            .min(1, "Họ tên không được để trống")
            .max(255, "Họ tên tối đa 255 ký tự")
            .trim()
            .optional(),

        address: z
            .string()
            .max(500, "Địa chỉ tối đa 500 ký tự")
            .trim()
            .optional(),

        phone: z
            .string()
            .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
            .optional(),
    }),
});