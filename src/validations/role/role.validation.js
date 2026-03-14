import { z } from "zod";
import { idParam } from "../common/params.js";

export const createRoleSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Tên role không được để trống")
            .max(50, "Tên role tối đa 50 ký tự")
            .trim(),

        description: z
            .string()
            .max(255, "Mô tả tối đa 255 ký tự")
            .trim()
            .optional()
            .nullable(),
    }),
});
export const updateRoleSchema = z.object({
    params: idParam,
    body: z
        .object({
            name: z
                .string()
                .min(1, "Tên role không được để trống")
                .max(50, "Tên role tối đa 50 ký tự")
                .trim()
                .optional(),

            description: z
                .string()
                .max(255, "Mô tả tối đa 255 ký tự")
                .trim()
                .optional()
                .nullable(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "Cần ít nhất 1 field để cập nhật",
        }),
});