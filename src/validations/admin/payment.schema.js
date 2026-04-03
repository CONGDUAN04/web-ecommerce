import { z } from "zod";
import { idParam } from "./params.js";

export const getPaymentsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),

      status: z
        .enum(["PENDING", "SUCCESS", "FAILED", "REFUNDED"], {
          message: "Trạng thái không hợp lệ",
        })
        .optional(),

      provider: z
        .enum(["COD", "VNPAY", "PAYPAL", "MOMO", "BANKING"], {
          message: "Phương thức không hợp lệ",
        })
        .optional(),

      keyword: z.string().max(100).trim().optional(),

      from: z.string().datetime({ message: "from không hợp lệ" }).optional(),
      to: z.string().datetime({ message: "to không hợp lệ" }).optional(),
    })

    .refine(
      (q) => (q.from && q.to ? new Date(q.from) <= new Date(q.to) : true),
      { message: "from phải nhỏ hơn hoặc bằng to", path: ["from"] },
    ),
});

export const confirmBankingSchema = z.object({
  params: idParam,
  body: z.object({
    transactionId: z
      .string({ required_error: "Vui lòng nhập mã giao dịch" })
      .min(1, "Mã giao dịch không được để trống")
      .max(200, "Mã giao dịch tối đa 200 ký tự")
      .trim(),
  }),
});
