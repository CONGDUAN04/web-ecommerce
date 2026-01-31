import { z } from "zod";
import { idParam, positiveInt } from "../common/params.js";
export const createColorSchema = z.object({
    body: z.object({
        productId: positiveInt,
        color: z
            .string()
            .trim()
            .min(1, "Tên màu không được để trống")
            .max(50, "Tên màu tối đa 50 ký tự"),

        price: z
            .string()
            .trim()
            .min(1, "Giá không được để trống")
            .transform(v => Number(v))
            .refine(v => !isNaN(v), {
                message: "Giá phải là số"
            })
            .refine(v => v > 0, {
                message: "Giá phải lớn hơn 0"
            })
    }),

    params: z.object({}).optional(),
    query: z.object({}).optional()
});
export const updateColorSchema = z.object({
    params: idParam,
    body: z
        .object({
            color: z
                .string()
                .trim()
                .min(1, "Tên màu không được để trống")
                .min(2, "Tên màu tối thiểu 2 ký tự")
                .max(50, "Tên màu tối đa 50 ký tự")
                .optional(),

            price: z
                .string()
                .trim()
                .min(1, "Giá không được để trống")
                .transform(v => Number(v))
                .refine(v => !isNaN(v), {
                    message: "Giá phải là số"
                })
                .refine(v => v > 0, {
                    message: "Giá phải lớn hơn 0"
                }).optional(),

            isActive: z.boolean().optional()
        }),
    query: z.object({}).optional()
});
