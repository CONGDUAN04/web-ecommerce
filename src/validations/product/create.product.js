import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Tên sản phẩm không được để trống")
            .max(255, "Tên sản phẩm tối đa 255 ký tự")
            .trim(),
        description: z.string().optional(),
        brandId: z
            .string()
            .transform((val) => Number(val))
            .refine((val) => !isNaN(val) && val > 0, {
                message: "Brand ID phải là số dương",
            }),
        categoryId: z
            .string()
            .transform((val) => Number(val))
            .refine((val) => !isNaN(val) && val > 0, {
                message: "Category ID phải là số dương",
            }),
        targetId: z
            .string()
            .transform((val) => Number(val))
            .refine((val) => !isNaN(val) && val > 0, {
                message: "Target ID phải là số dương",
            }),
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional(),
});