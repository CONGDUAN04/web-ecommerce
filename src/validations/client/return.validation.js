import { z } from "zod";

const returnItemSchema = z.object({
  orderItemId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  reason: z.string().max(500).optional(),
});

export const createReturnRequestSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    reason: z.enum([
      "WRONG_PRODUCT",
      "DEFECTIVE",
      "NOT_AS_DESCRIBED",
      "CHANGED_MIND",
      "OTHER",
    ]),
    note: z.string().max(1000).optional(),
    evidence: z.array(z.string().url()).max(5).optional(),
    items: z
      .array(returnItemSchema)
      .min(1, "Cần ít nhất 1 sản phẩm để hoàn trả"),
  }),
});

export const getReturnRequestSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
