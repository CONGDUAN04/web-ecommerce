import { z } from "zod";
import { idParam, positiveInt } from "../common/params.js";
import { zBoolean } from "../common/boolean.schema.js";
import { paginationSchema } from "../common/query.js";


export const createProductSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: "Tên sản phẩm không được để trống" })
            .trim()
            .min(3, "Tên tối thiểu 3 ký tự")
            .max(200, "Tên tối đa 200 ký tự"),

        // Bắt buộc — brandId/categoryId tự lấy từ group
        groupId: positiveInt,

        description: z.string().trim().optional(),
        thumbnail: z.string().trim().optional()
    }),

    params: z.object({}).optional(),
    query: z.object({}).optional()
});

export const updateProductSchema = z.object({
    params: idParam,

    body: z.object({
        name: z
            .string()
            .trim()
            .min(3, "Tên tối thiểu 3 ký tự")
            .max(200, "Tên tối đa 200 ký tự")
            .optional(),

        groupId: positiveInt.optional(),
        description: z.string().trim().optional(),
        thumbnail: z.string().trim().optional(),
        isActive: zBoolean.optional()
    }).optional(),

    query: z.object({}).optional()
});

export const getProductsQuerySchema = paginationSchema.extend({
    query: paginationSchema.shape.query.extend({
        page: z.string().optional(),
        limit: z.string().optional(),
        groupId: z.string().optional(),    // ?groupId=1   → lấy product trong group
        brandId: z.string().optional(),    // ?brandId=1
        categoryId: z.string().optional(),    // ?categoryId=1
        search: z.string().trim().optional() // ?search=iphone
    }),

    params: z.object({}).optional(),
    body: z.object({}).optional()
});