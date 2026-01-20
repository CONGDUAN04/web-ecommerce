import { storageItemSchema } from "./item.storage.js";
import { z } from "zod"
export const createStorageSchema = z.object({
    body: z.object({
        colorId: z
            .union([z.number(), z.string()])
            .refine((val) => val !== null && val !== undefined && val !== "", {
                message: "ID không được để trống",
            })
            .transform((val) => Number(val))
            .refine((val) => !isNaN(val) && val > 0, {
                message: "ID phải là số nguyên dương ",
            }),

        storages: z
            .array(storageItemSchema)
            .min(1, "Phải có ít nhất 1 dung lượng")
            .max(2, "Tối đa 1 dung lượng"),
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional(),
});
