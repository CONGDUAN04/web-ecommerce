import { z } from "zod";
import { idParam } from "./params.js";

const flashSaleItemSchema = z.object({
  variantId: z
    .number({ required_error: "variantId không được để trống" })
    .int()
    .positive("variantId phải là số nguyên dương"),
  salePrice: z
    .number({ required_error: "Giá flash sale không được để trống" })
    .int()
    .positive("Giá flash sale phải lớn hơn 0"),
  quantity: z
    .number({ required_error: "Số lượng không được để trống" })
    .int()
    .positive("Số lượng phải lớn hơn 0"),
});

const baseFlashSaleSchema = z.object({
  name: z
    .string({ required_error: "Tên flash sale không được để trống" })
    .min(1, "Tên flash sale không được để trống")
    .max(255, "Tên flash sale tối đa 255 ký tự")
    .trim(),
  startTime: z.coerce.date({
    required_error: "Thời gian bắt đầu không được để trống",
  }),
  endTime: z.coerce.date({
    required_error: "Thời gian kết thúc không được để trống",
  }),
  isActive: z.boolean().optional().default(true),
  items: z
    .array(flashSaleItemSchema)
    .min(1, "Flash sale phải có ít nhất 1 sản phẩm"),
});

export const createFlashSaleSchema = z
  .object({ body: baseFlashSaleSchema })
  .superRefine(({ body }, ctx) => {
    if (body.endTime <= body.startTime) {
      ctx.addIssue({
        path: ["body", "endTime"],
        code: z.ZodIssueCode.custom,
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      });
    }

    const variantIds = body.items.map((i) => i.variantId);
    const hasDuplicate = new Set(variantIds).size !== variantIds.length;
    if (hasDuplicate) {
      ctx.addIssue({
        path: ["body", "items"],
        code: z.ZodIssueCode.custom,
        message: "Không được có variant trùng nhau trong flash sale",
      });
    }
  });

export const updateFlashSaleSchema = z
  .object({
    params: idParam,
    body: z.object({
      name: z
        .string()
        .min(1, "Tên flash sale không được để trống")
        .max(255, "Tên flash sale tối đa 255 ký tự")
        .trim()
        .optional(),
      startTime: z.coerce.date().optional(),
      endTime: z.coerce.date().optional(),
      isActive: z.boolean().optional(),
    }),
  })
  .superRefine(({ body }, ctx) => {
    if (body.startTime && body.endTime && body.endTime <= body.startTime) {
      ctx.addIssue({
        path: ["body", "endTime"],
        code: z.ZodIssueCode.custom,
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      });
    }
  });

export const addFlashSaleItemsSchema = z.object({
  params: idParam,
  body: z.object({
    items: z.array(flashSaleItemSchema).min(1, "Phải có ít nhất 1 sản phẩm"),
  }),
});

export const updateFlashSaleItemSchema = z.object({
  params: z.object({
    id: idParam.shape.id,
    itemId: idParam.shape.id,
  }),
  body: z.object({
    salePrice: z
      .number()
      .int()
      .positive("Giá flash sale phải lớn hơn 0")
      .optional(),
    quantity: z.number().int().positive("Số lượng phải lớn hơn 0").optional(),
  }),
});

export const deleteFlashSaleItemSchema = z.object({
  params: z.object({
    id: idParam.shape.id,
    itemId: idParam.shape.id,
  }),
});
