import { idParam } from "../common/params.js";
import { z } from "zod"
export const updateBrandSchema = z.object({
    params: idParam,
    body: z.object({
        name: z
            .string()
            .min(1, "Tên thương hiệu không được để trống")
            .max(255, "Tên thương hiệu tối đa 255 ký tự")
            .trim()
            .optional(),

        description: z
            .string()
            .max(500, "Mô tả tối đa 500 ký tự")
            .trim()
            .optional()
            .nullable(),
    }),
    query: z.object({}).optional(),
});