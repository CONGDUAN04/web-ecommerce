import { z } from "zod";

export const createColorSchema = z.object({
    body: z.object({
        color: z
            .string()
            .min(1, "Tên màu không được để trống")
            .max(100, "Tên màu tối đa 100 ký tự")
            .trim(),

        productId: z
            .string()
            .min(1, "Product ID không được để trống")
            .regex(/^\d+$/, "Product ID phải là số nguyên dương")
            .transform(Number),
    }),
});
