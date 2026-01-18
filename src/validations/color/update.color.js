import { z } from "zod";
import { idParam } from "../common/params.js";
export const updateColorSchema = z.object({
    params: idParam,
    body: z.object({
        color: z
            .string()
            .min(1, "Tên màu không được để trống")
            .max(100, "Tên màu tối đa 100 ký tự")
            .trim()
            .optional(),

        productId: z
            .string()
            .regex(/^\d+$/, "Product ID phải là số nguyên dương")
            .transform(Number)
            .optional(),
    }).refine(
        (data) => data.color !== undefined || data.productId !== undefined,
        { message: "Phải cung cấp ít nhất một trường để cập nhật" }
    ),
});