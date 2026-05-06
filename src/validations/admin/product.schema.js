import { z } from "zod";
import { idParam, positiveInt } from "./params.js";
import { zBoolean } from "./boolean.schema.js";
import { paginationSchema } from "./query.js";

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Tên sản phẩm không được để trống" })
      .trim()
      .min(3, "Tên tối thiểu 3 ký tự")
      .max(200, "Tên tối đa 200 ký tự"),

    groupId: positiveInt,
    storage: z.string().trim().max(100, "Storage tối đa 100 ký tự").optional(),

    description: z.string().trim().optional(),
    thumbnail: z.string().trim().optional(),
    thumbnailId: z.string().trim().optional(),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateProductSchema = z.object({
  params: idParam,

  body: z
    .object({
      name: z.string().trim().min(3).max(200).optional(),
      groupId: positiveInt.optional(),
      storage: z
        .string()
        .trim()
        .max(100, "Storage tối đa 100 ký tự")
        .optional(),
      description: z.string().trim().nullish(),
      thumbnail: z.string().trim().optional(),
      thumbnailId: z.string().trim().optional(),
      isActive: zBoolean.optional(),
    })
    .optional(),

  query: z.object({}).optional(),
});

export const getProductsQuerySchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    groupId: z.coerce.number().int().positive().optional(),
    brandId: z.coerce.number().int().positive().optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    search: z.string().trim().optional(),
  }),

  params: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const updateProductStatusSchema = z.object({
  params: idParam,
  body: z.object({
    isActive: z.boolean(),
  }),
});
