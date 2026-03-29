import { z } from "zod";
import { idParam } from "../common/params.js";

// ========================
// GET /admin/orders
// ========================
export const getOrdersSchema = z.object({
  query: z
    .object({
      page: z.coerce
        .number({ message: "Page phải là số nguyên" })
        .int()
        .min(1, "Page phải lớn hơn hoặc bằng 1")
        .default(1),

      limit: z.coerce
        .number({ message: "Limit phải là số nguyên" })
        .int()
        .min(1)
        .max(100, "Limit tối đa là 100")
        .default(10),

      status: z
        .enum(
          [
            "PENDING",
            "CONFIRMED",
            "SHIPPING",
            "COMPLETED",
            "CANCELLED",
            "RETURN_REQUESTED",
            "RETURN_APPROVED",
            "RETURNED",
          ],
          { message: "Trạng thái đơn hàng không hợp lệ" },
        )
        .optional(),

      paymentStatus: z
        .enum(["PENDING", "SUCCESS", "FAILED", "REFUNDED"], {
          message: "Trạng thái thanh toán không hợp lệ",
        })
        .optional(),

      paymentMethod: z
        .enum(["COD", "VNPAY", "PAYPAL", "MOMO", "BANKING"], {
          message: "Phương thức thanh toán không hợp lệ",
        })
        .optional(),

      userId: z.coerce
        .number({ message: "userId phải là số" })
        .int()
        .positive()
        .optional(),

      keyword: z
        .string()
        .max(100, "Keyword tối đa 100 ký tự")
        .trim()
        .optional(),

      from: z
        .string()
        .datetime({ message: "from phải là ISO datetime hợp lệ" })
        .optional(),

      to: z
        .string()
        .datetime({ message: "to phải là ISO datetime hợp lệ" })
        .optional(),
    })
    .refine(
      (q) => (q.from && q.to ? new Date(q.from) <= new Date(q.to) : true),
      { message: "from phải nhỏ hơn hoặc bằng to", path: ["from"] },
    ),
});

// ========================
// PATCH /admin/orders/:id/ship
// ========================
export const shipOrderSchema = z.object({
  params: idParam,
  body: z.object({
    trackingCode: z
      .string()
      .max(100, "Tracking code tối đa 100 ký tự")
      .trim()
      .optional(),
  }),
});

// ========================
// PATCH /admin/orders/:id/cancel
// ========================
export const cancelOrderSchema = z.object({
  params: idParam,
  body: z.object({
    cancelReason: z
      .string()
      .max(500, "Lý do huỷ tối đa 500 ký tự")
      .trim()
      .optional(),
  }),
});

// ========================
// PATCH /admin/orders/:id/return/approve
// ========================
export const approveReturnSchema = z.object({
  params: idParam,
  body: z.object({
    refundAmount: z
      .number({ message: "refundAmount phải là số" })
      .int("refundAmount phải là số nguyên")
      .min(0, "refundAmount không được âm"),

    adminNote: z
      .string()
      .max(500, "Ghi chú tối đa 500 ký tự")
      .trim()
      .optional(),
  }),
});

// ========================
// PATCH /admin/orders/:id/return/reject
// ========================
export const rejectReturnSchema = z.object({
  params: idParam,
  body: z.object({
    adminNote: z
      .string()
      .min(1, "Vui lòng nhập lý do từ chối")
      .max(500, "Ghi chú tối đa 500 ký tự")
      .trim(),
  }),
});

// ========================
// PATCH /admin/orders/:id/return/complete
// ========================
export const completeReturnSchema = z.object({
  params: idParam,
  body: z
    .object({
      refundId: z
        .string()
        .max(200, "refundId tối đa 200 ký tự")
        .trim()
        .optional(),
      refundNote: z
        .string()
        .max(500, "Ghi chú tối đa 500 ký tự")
        .trim()
        .optional(),
    })
    .optional()
    .default({}),
});
