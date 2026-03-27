import { z } from "zod";
import { idParam, positiveInt } from "../common/params.js";
import { zBoolean } from "../common/boolean.schema.js";

// ========================
// CREATE
// ========================

export const createVariantSchema = z.object({
  body: z
    .object({
      productId: positiveInt,

      sku: z
        .string({ required_error: "SKU không được để trống" })
        .trim()
        .min(3, "SKU tối thiểu 3 ký tự")
        .max(50, "SKU tối đa 50 ký tự"),

      color: z
        .string({ required_error: "Màu sắc không được để trống" })
        .trim()
        .min(1, "Màu sắc không được để trống")
        .max(50, "Màu sắc tối đa 50 ký tự"),

      price: z
        .number({ required_error: "Giá không được để trống" })
        .int("Giá phải là số nguyên")
        .positive("Giá phải lớn hơn 0"),

      comparePrice: z
        .number()
        .int("Giá gốc phải là số nguyên")
        .positive("Giá gốc phải lớn hơn 0")
        .optional(),

      quantity: z
        .number()
        .int("Số lượng phải là số nguyên")
        .min(0, "Số lượng không được âm")
        .default(0),
    })
    .superRefine((data, ctx) => {
      // comparePrice phải lớn hơn hoặc bằng price
      if (data.comparePrice && data.comparePrice < data.price) {
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

// ========================
// UPDATE
// ========================

export const updateVariantSchema = z.object({
  params: idParam,

  body: z
    .object({
      sku: z
        .string()
        .trim()
        .min(3, "SKU tối thiểu 3 ký tự")
        .max(50, "SKU tối đa 50 ký tự")
        .optional(),

      color: z
        .string()
        .trim()
        .min(1, "Màu sắc không được để trống")
        .max(50, "Màu sắc tối đa 50 ký tự")
        .optional(),

      price: z
        .number()
        .int("Giá phải là số nguyên")
        .positive("Giá phải lớn hơn 0")
        .optional(),

      comparePrice: z
        .number()
        .int("Giá gốc phải là số nguyên")
        .positive("Giá gốc phải lớn hơn 0")
        .nullable() // cho phép xóa comparePrice
        .optional(),

      quantity: z
        .number()
        .int("Số lượng phải là số nguyên")
        .min(0, "Số lượng không được âm")
        .optional(),

      isActive: zBoolean.optional(),
    })
    .optional(),

  query: z.object({}).optional(),
});

// ========================
// GET LIST QUERY
// ========================

export const getVariantsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    productId: z.string().optional(), // ?productId=1
    storage: z.string().optional(), // ?storage=256
    color: z.string().trim().optional(), // ?color=Cam Vũ Trụ
  }),

  params: z.object({}).optional(),
  body: z.object({}).optional(),
});
