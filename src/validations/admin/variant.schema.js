import { z } from "zod";

import { idParam, positiveInt } from "./params.js";
import { zBoolean } from "./boolean.schema.js";
import { paginationSchema } from "./query.js";

const storageSchema = z
  .string()
  .trim()
  .min(1, "Dung lượng không được để trống")
  .max(20, "Dung lượng tối đa 20 ký tự")
  .nullable()
  .optional();

const variantBody = {
  productId: positiveInt,

  productColorId: positiveInt,

  sku: z
    .string()
    .trim()
    .min(3, "SKU tối thiểu 3 ký tự")
    .max(50, "SKU tối đa 50 ký tự"),

  storage: storageSchema,

  price: z
    .number({
      required_error: "Giá không được để trống",
    })
    .int("Giá phải là số nguyên")
    .positive("Giá phải lớn hơn 0"),

  comparePrice: z
    .number()
    .int("Giá gốc phải là số nguyên")
    .positive("Giá gốc phải lớn hơn 0")
    .nullable()
    .optional(),

  quantity: z
    .number()
    .int("Số lượng phải là số nguyên")
    .min(0, "Số lượng không được âm")
    .default(0),
};

export const createVariantSchema = z.object({
  body: z.object(variantBody).superRefine((data, ctx) => {
    if (
      data.comparePrice !== null &&
      data.comparePrice !== undefined &&
      data.comparePrice < data.price
    ) {
      ctx.addIssue({
        path: ["comparePrice"],

        code: z.ZodIssueCode.custom,

        message: "Giá gốc phải lớn hơn hoặc bằng giá bán",
      });
    }
  }),

  params: z.object({}).optional(),

  query: z.object({}).optional(),
});

export const updateVariantSchema = z.object({
  params: idParam,

  body: z
    .object({
      sku: variantBody.sku.optional(),

      storage: storageSchema,

      productColorId: positiveInt.optional(),

      price: variantBody.price.optional(),

      comparePrice: variantBody.comparePrice,

      quantity: variantBody.quantity.optional(),

      isActive: zBoolean.optional(),
    })

    .refine((data) => Object.keys(data).length > 0, {
      message: "Cần ít nhất một trường để cập nhật",
    }),

  query: z.object({}).optional(),
});

export const getVariantsQuerySchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    productId: z.coerce.number().int().positive().optional(),

    colorId: z.coerce.number().int().positive().optional(),

    storage: z.string().trim().optional(),
  }),

  params: z.object({}).optional(),

  body: z.object({}).optional(),
});

export const updateVariantStatusSchema = z.object({
  params: idParam,

  body: z.object({
    isActive: z.boolean(),
  }),
});
