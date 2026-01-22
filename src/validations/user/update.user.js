import { z } from "zod";
import { idParam } from "../common/params.js";

export const updateUserSchema = z.object({
    params: idParam,
    body: z.object({
        fullName: z
            .string()
            .min(1, "Họ tên không được để trống")
            .max(255, "Họ tên tối đa 255 ký tự")
            .trim()
            .optional(),

        phone: z
            .string()
            .regex(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)")
            .optional()
            .nullable()
            .or(z.literal("")),

        roleId: z
            .union([z.number(), z.string()])
            .transform((val) => {
                if (val === null || val === undefined || val === "") return null;
                return Number(val);
            })
            .refine((val) => val === null || (!isNaN(val) && val > 0), {
                message: "Role ID phải là số dương hoặc để trống",
            })
            .optional()
            .nullable(),
    }),
    query: z.object({}).optional(),
});