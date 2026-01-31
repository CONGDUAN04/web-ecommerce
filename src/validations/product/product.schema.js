import { z } from "zod";
import { idParam, positiveInt } from "../common/params.js";
import { zBoolean } from "../common/boolean.schema.js";

export const createProductSchema = z.object({
    body: z.object({
        productGroupId: positiveInt,

        name: z.string().trim().min(1),

        description: z
            .string()
            .trim()
            .max(1000)
            .optional()
    })
});

export const updateProductSchema = z.object({
    params: idParam,
    body: z.object({
        name: z.string().trim().min(1).optional(),

        description: z
            .string()
            .trim()
            .max(1000)
            .optional(),
        isActive: zBoolean.optional()
    })
});

