import { z } from "zod"
export const createBrandSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Tên thương hiệu không được để trống")
            .max(255, "Tên thương hiệu tối đa 255 ký tự")
            .trim(),

        description: z
            .string()
            .max(500, "Mô tả tối đa 500 ký tự")
            .trim()
            .optional()
            .nullable(),
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional(),
});