import { z } from "zod";
import { idParam, positiveInt } from "../common/params.js";
import { zBoolean } from "../common/boolean.schema.js";

export const createProductSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(3, "Tên phải ít nhất 3 ký tự")
            .max(100, "Tên tối đa 100 ký tự"),

        brandId: positiveInt,

        categoryId: positiveInt,

        description: z.string().max(500).optional(),

        thumbnail: z.string().url("Thumbnail phải là URL hợp lệ").optional()
    })
});

export const updateProductSchema = z.object({
    params: idParam,

    body: z.object({
        name: z
            .string()
            .trim()
            .min(3)
            .max(100)
            .optional(),

        brandId: positiveInt.optional(),

        categoryId: positiveInt.optional(),

        description: z.string().max(500).optional(),

        thumbnail: z.string().url().optional(),

        isActive: zBoolean.optional()
    })
});