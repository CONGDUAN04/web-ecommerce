import { z } from "zod"
export const storageItemSchema = z.object({
    name: z
        .string()
        .min(1, "Tên dung lượng không được để trống")
        .max(100, "Tên dung lượng tối đa 100 ký tự")
        .trim(),

    price: z
        .union([z.number(), z.string()])
        .refine((val) => val !== null && val !== undefined && val !== "", {
            message: "Giá không được để trống",
        })
        .refine((val) => {
            const numVal = typeof val === "string"
                ? Number(val.replace(/\./g, ""))
                : val;
            return !isNaN(numVal) && numVal >= 0;
        }, {
            message: "Giá phải là số không âm",
        })
        .transform((val) => {
            return typeof val === "string"
                ? Number(val.replace(/\./g, ""))
                : val;
        }),

    quantity: z
        .union([z.number(), z.string()])
        .refine((val) => {
            const numVal = Number(val);
            return !isNaN(numVal) && Number.isInteger(numVal) && numVal >= 0;
        }, {
            message: "Số lượng phải là số nguyên không âm",
        })
        .transform((val) => Number(val)),
});