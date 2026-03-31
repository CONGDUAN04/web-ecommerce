import { z } from "zod";
import { paginationSchema } from "../../validations/admin/query.js";

export const createOrderSchema = z.object({
  body: z.object({
    // Thông tin giao hàng
    receiverName: z
      .string({ required_error: "Tên người nhận không được để trống" })
      .trim()
      .min(2, "Tên tối thiểu 2 ký tự"),
    receiverPhone: z
      .string({ required_error: "Số điện thoại không được để trống" })
      .trim()
      .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
    receiverAddress: z
      .string({ required_error: "Địa chỉ không được để trống" })
      .trim()
      .min(10, "Địa chỉ tối thiểu 10 ký tự"),

    // Thanh toán
    paymentMethod: z.enum(["COD", "VNPAY", "MOMO", "BANKING", "PAYPAL"], {
      required_error: "Phương thức thanh toán không được để trống",
    }),

    // Tuỳ chọn
    voucherCode: z.string().trim().optional(),
    note: z.string().trim().optional(),

    // Items (nếu không truyền thì lấy từ cart)
    items: z
      .array(
        z.object({
          variantId: z.number().int().positive(),
          quantity: z.number().int().min(1).max(100),
        }),
      )
      .optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const getOrdersSchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    status: z
      .enum([
        "PENDING",
        "CONFIRMED",
        "SHIPPING",
        "COMPLETED",
        "CANCELLED",
        "RETURN_REQUESTED",
        "RETURN_APPROVED",
        "RETURNED",
      ])
      .optional(),
  }),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => !isNaN(parseInt(val)), "id không hợp lệ"),
  }),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const cancelOrderSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => !isNaN(parseInt(val)), "id không hợp lệ"),
  }),
  body: z.object({
    cancelReason: z
      .string({ required_error: "Lý do huỷ không được để trống" })
      .trim()
      .min(5, "Lý do tối thiểu 5 ký tự"),
  }),
  query: z.object({}).optional(),
});
