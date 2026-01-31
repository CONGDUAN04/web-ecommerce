import { z } from 'zod'
import { idParam, positiveInt } from "../common/params.js";
import { zBoolean } from '../common/boolean.schema.js';

export const createProductGroupSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(1, "Tên nhóm không được để trống")
            .min(3, "Tên tối thiểu 3 ký tự")
            .max(100, "Tên tối đa 100 ký tự"),

        brandId: positiveInt,
        categoryId: positiveInt
    }),

    params: z.object({}).optional(),
    query: z.object({}).optional()
});
export const updateProductGroupSchema = z.object({
    params: idParam,
    body: z
        .object({
            name: z
                .string()
                .trim()
                .min(1, "Tên nhóm không được để trống")
                .min(3, "Tên tối thiểu 3 ký tự")
                .max(100, "Tên tối đa 100 ký tự")
                .optional(),

            brandId: positiveInt.optional(),
            categoryId: positiveInt.optional(),
            isActive: zBoolean.optional()
        }),
    query: z.object({}).optional()
});