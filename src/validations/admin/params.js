import { z } from "zod";

export const positiveInt = z
    .union([z.string(), z.number()])
    .refine(
        (val) => {
            const num = Number(val);
            return !isNaN(num);
        },
        { message: "ID Phải là số" }
    )
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val), {
        message: "ID Phải là số nguyên"
    })
    .refine((val) => val > 0, {
        message: "ID Phải là số nguyên dương"
    });

export const idParam = z.object({
    id: z
        .union([z.string(), z.number()])
        .refine(
            (val) => {
                const num = Number(val);
                return !isNaN(num);
            },
            { message: "ID phải là số" }
        )
        .transform((val) => Number(val))
        .refine((val) => Number.isInteger(val), {
            message: "ID phải là số nguyên"
        })
        .refine((val) => val > 0, {
            message: "ID phải là số nguyên dương"
        })
});

export const idParamSchema = z.object({
    params: idParam
});