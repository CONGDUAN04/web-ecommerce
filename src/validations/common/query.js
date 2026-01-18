import { z } from "zod";

export const paginationSchema = z.object({
    query: z.object({
        page: z.coerce
            .number({ message: "Page phải là số nguyên" })
            .int("Page phải là số nguyên")
            .min(1, "Page phải lớn hơn hoặc bằng 1")
            .default(1),

        limit: z.coerce
            .number({ message: "Limit phải là số nguyên" })
            .int("Limit phải là số nguyên")
            .min(1, "Limit phải lớn hơn hoặc bằng 1")
            .max(100, "Limit tối đa là 100")
            .default(10),
    }),
});