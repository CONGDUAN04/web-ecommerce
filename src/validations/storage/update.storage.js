import { z } from "zod"
import { idParam } from "../common/params.js";
export const updateStorageSchema = z.object({
    params: idParam,
    body: z.object({
        name: z
            .string()
            .min(1, "Tên dung lượng không được để trống")
            .max(100, "Tên dung lượng tối đa 100 ký tự")
            .trim()
            .optional(),

        price: z
            .union([z.number(), z.string()])
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
            })
            .optional(),

        quantity: z
            .union([z.number(), z.string()])
            .refine((val) => {
                const numVal = Number(val);
                return !isNaN(numVal) && Number.isInteger(numVal) && numVal >= 0;
            }, {
                message: "Số lượng phải là số nguyên dương",
            })
            .transform((val) => Number(val))
            .optional(),
    }),
    query: z.object({}).optional(),
});