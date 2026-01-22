import { z } from "zod";
import { storageItemSchema } from "./item.storage.js";

export const createStorageSchema = z.object({
    body: z.object({
        colorId: z
            .string()
            .min(1, "Color ID không được để trống")
            .regex(/^\d+$/, "Color ID phải là số nguyên dương")
            .transform(Number),

        storages: z
            .array(storageItemSchema)
            .min(1, "Phải có ít nhất 1 dung lượng")
            .max(2, "Tối đa 2 dung lượng"),
    }),
});
