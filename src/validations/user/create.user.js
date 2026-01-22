import { z } from "zod";
export const createUserSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(1, "Username không được để trống")
            .email("Username phải là email hợp lệ")
            .max(255, "Username tối đa 255 ký tự")
            .trim()
            .toLowerCase(),

        fullName: z
            .string()
            .min(1, "Họ tên không được để trống")
            .max(255, "Họ tên tối đa 255 ký tự")
            .trim(),

        phone: z
            .string()
            .regex(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)")
            .optional()
            .nullable(),

        roleId: z
            .union([z.number(), z.string()])
            .refine((val) => val !== null && val !== undefined && val !== "", {
                message: "RoleID không được để trống",
            })
            .transform((val) => Number(val))
            .refine((val) => !isNaN(val) && val > 0, {
                message: "RoleID phải là số nguyên dương",
            }),
    }),
});