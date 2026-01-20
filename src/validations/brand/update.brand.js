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
    }),
    query: z.object({}).optional(),
});