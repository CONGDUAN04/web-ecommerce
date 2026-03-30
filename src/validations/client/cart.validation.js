import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    variantId: z
      .number({ required_error: "variantId không được để trống" })
      .int()
      .positive("variantId không hợp lệ"),
    quantity: z
      .number()
      .int()
      .min(1, "Số lượng tối thiểu là 1")
      .max(100, "Số lượng tối đa là 100")
      .default(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z
      .string()
      .refine((val) => !isNaN(parseInt(val)), "itemId không hợp lệ"),
  }),
  body: z.object({
    quantity: z
      .number({ required_error: "Số lượng không được để trống" })
      .int()
      .min(1, "Số lượng tối thiểu là 1")
      .max(100, "Số lượng tối đa là 100"),
  }),
  query: z.object({}).optional(),
});

export const removeCartItemSchema = z.object({
  params: z.object({
    itemId: z
      .string()
      .refine((val) => !isNaN(parseInt(val)), "itemId không hợp lệ"),
  }),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});
