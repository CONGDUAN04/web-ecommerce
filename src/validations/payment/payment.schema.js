import { z } from "zod";
import { idParam } from "../common/params.js";

export const getPaymentsSchema = z.object({
  query: z.object({
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
  }),
});

export const confirmBankingSchema = z.object({
  params: idParam,
  body: z.object({
    transactionId: z.string().max(200).trim().optional(),
    note: z.string().max(500).trim().optional(),
  }),
});
