import { z } from "zod";
import { idParam } from "../common/params.js";

export const updateRoleSchema = z.object({
    params: idParam,
    body: z.object({
        name: z
            .string()
            .min(1, "Tên role không được để trống")
            .max(50, "Tên role tối đa 50 ký tự")
            .optional(),

        description: z.string().optional().nullable(),
    }),
});
