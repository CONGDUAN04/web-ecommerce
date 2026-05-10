import { z } from "zod";

import { idParam, positiveInt } from "./params.js";
import { paginationSchema } from "./query.js";

const urlField = z.string().url("Ảnh phải là URL hợp lệ").optional();

const publicIdField = z.string().optional();

export const createProductColorSchema = z.object({
  body: z.object({
    productId: positiveInt,

    colorId: positiveInt,

    image: urlField,

    imageId: publicIdField,
  }),
});

export const updateProductColorSchema = z.object({
  params: idParam,

  body: z.object({
    colorId: positiveInt.optional(),

    image: urlField.optional(),

    imageId: publicIdField.optional(),
  }),
});

export const getProductColorsQuerySchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    productId: z.coerce.number().int().positive().optional(),

    colorId: z.coerce.number().int().positive().optional(),
  }),

  params: z.object({}).optional(),

  body: z.object({}).optional(),
});
