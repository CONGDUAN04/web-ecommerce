import { z } from "zod";

export const createRoleSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Tên role không được để trống")
            .max(50, "Tên role tối đa 50 ký tự"),

        description: z.string().optional().nullable(),
    }),
});
