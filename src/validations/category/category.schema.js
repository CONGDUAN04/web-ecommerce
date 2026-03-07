import { z } from "zod";
import { idParam } from "../common/params.js";

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

        parentId: z
            .coerce.number()
            .int()
            .positive()
            .optional()
            .nullable(),
    }),
});

export const updateCategorySchema = z.object({
    params: idParam,

    body: z.object({
        name: z
            .string()
            .min(1, "Tên danh mục không được để trống")
            .max(255, "Tên danh mục tối đa 255 ký tự")
            .trim()
            .optional(),

        description: z
            .string()
            .max(500, "Mô tả tối đa 500 ký tự")
            .trim()
            .optional(),

        parentId: z
            .coerce.number()
            .int()
            .positive()
            .optional()
            .nullable(),
    }),
});