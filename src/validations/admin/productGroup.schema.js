import { z } from "zod";
import { idParam, positiveInt } from "./params.js";
import { zBoolean } from "./boolean.schema.js";
import { paginationSchema } from "./query.js";

export const createProductGroupSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Tên không được để trống" })
      .trim()
      .min(3, "Tên tối thiểu 3 ký tự")
      .max(100, "Tên tối đa 100 ký tự"),

    series: z.string().trim().max(100, "Series tối đa 100 ký tự").optional(),

    brandId: positiveInt,
    categoryId: positiveInt,

    description: z.string().trim().optional(),
    thumbnail: z.string().trim().optional(),
    thumbnailId: z.string().trim().optional(),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateProductGroupSchema = z.object({
  params: idParam,

  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(3, "Tên tối thiểu 3 ký tự")
        .max(100, "Tên tối đa 100 ký tự")
        .optional(),

      series: z.string().trim().max(100).optional(),
      brandId: positiveInt.optional(),
      categoryId: positiveInt.optional(),
      description: z.string().trim().nullish(),
      thumbnail: z.string().trim().optional(),
      thumbnailId: z.string().trim().optional(),
      isActive: zBoolean.optional(),
    })
    .optional(),

  query: z.object({}).optional(),
});

export const getProductGroupsQuerySchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    series: z.string().trim().optional(),
    brandId: z.coerce.number().int().positive().optional(),
    categoryId: z.coerce.number().int().positive().optional(),
  }),

  params: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const updateProductGroupStatusSchema = z.object({
  params: idParam,
  body: z.object({
    isActive: z.boolean(),
  }),
});
