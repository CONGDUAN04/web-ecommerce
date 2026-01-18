import { z } from "zod"
export const createCategorySchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Tên danh mục không được để trống")
            .max(255, "Tên danh mục tối đa 255 ký tự")
            .trim(),

        description: z
            .string()
            .max(500, "Mô tả tối đa 500 ký tự")
            .trim()
            .optional(),
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional(),
});