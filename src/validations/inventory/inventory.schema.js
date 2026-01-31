import { z } from "zod";
export const inventorySchema = z.object({
    body: z.object({
        colorId: z
            .string()
            .trim()
            .min(1, "colorId không được để trống")
            .transform(v => Number(v))
            .refine(v => Number.isInteger(v) && v > 0, {
                message: "colorId phải là số nguyên dương"
            }),

        quantity: z
            .string()
            .trim()
            .min(1, "quantity không được để trống")
            .transform(v => Number(v))
            .refine(v => Number.isInteger(v) && v > 0, {
                message: "quantity phải là số nguyên dương"
            }),

        note: z
            .string()
            .trim()
            .max(255, "Ghi chú tối đa 255 ký tự")
            .optional()
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional()
});
export const adjustInventorySchema = z.object({
    body: z.object({
        colorId: z
            .string()
            .trim()
            .min(1, "colorId không được để trống")
            .transform(v => Number(v))
            .refine(v => Number.isInteger(v) && v > 0, {
                message: "colorId phải là số nguyên dương"
            }),

        quantity: z
            .string()
            .trim()
            .min(1, "quantity không được để trống")
            .transform(v => Number(v))
        ,
        note: z
            .string()
            .trim()
            .max(255, "Ghi chú tối đa 255 ký tự")
            .optional()
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional()
});