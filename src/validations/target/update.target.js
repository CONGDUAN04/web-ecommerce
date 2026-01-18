import { z } from "zod"
import { idParam } from "../common/params.js";
export const updateTargetSchema = z.object({
    params: idParam,
    body: z.object({
        name: z
            .string()
            .min(1, "Tên mục tiêu không được để trống")
            .max(255, "Tên mục tiêu tối đa 255 ký tự")
            .trim()
            .optional(),

        description: z
            .string()
            .max(500, "Mô tả tối đa 500 ký tự")
            .trim()
            .optional(),
    }),
    query: z.object({}).optional(),
});