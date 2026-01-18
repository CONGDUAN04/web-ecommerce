import { z } from "zod";

export const idParam = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "ID phải là số nguyên dương")
        .transform(Number)
        .refine((val) => val > 0, "ID phải lớn hơn 0"),
});
export const idParamSchema = z.object({
    params: idParam,
});
