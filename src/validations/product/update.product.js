import { z } from "zod";
import { idParam } from "../common/params.js";

export const updateProductSchema = z.object({
    params: idParam,
    body: z.object({
        name: z
            .string()
            .min(1, "Tên sản phẩm không được để trống")
            .max(255, "Tên sản phẩm tối đa 255 ký tự")
            .trim()
            .optional(),
        description: z.string().optional(),
        isActive: z
            .union([z.boolean(), z.string()])
            .transform((val) => {
                if (typeof val === "boolean") return val;
                if (val === "true") return true;
                if (val === "false") return false;
                return undefined;
            })
            .optional(),
        brandId: z
            .union([z.number(), z.string()])
            .transform((val) => Number(val))
            .refine((val) => !isNaN(val) && val > 0, {
                message: "Brand ID phải là số dương",
            })
            .optional(),
        categoryId: z
            .union([z.number(), z.string()])
            .transform((val) => Number(val))
            .refine((val) => !isNaN(val) && val > 0, {
                message: "Category ID phải là số dương",
            })
            .optional(),
        targetId: z
            .union([z.number(), z.string()])
            .transform((val) => Number(val))
            .refine((val) => !isNaN(val) && val > 0, {
                message: "Target ID phải là số dương",
            })
            .optional(),
    }),
    query: z.object({}).optional(),
});