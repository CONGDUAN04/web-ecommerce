import { z } from "zod";

const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

const addressIdParam = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)), "id không hợp lệ"),
});

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "Tên không được để trống" })
      .trim()
      .min(2, "Tên tối thiểu 2 ký tự"),
    phone: z
      .string({ required_error: "Số điện thoại không được để trống" })
      .trim()
      .regex(phoneRegex, "Số điện thoại không hợp lệ"),
    address: z
      .string({ required_error: "Địa chỉ không được để trống" })
      .trim()
      .min(10, "Địa chỉ tối thiểu 10 ký tự"),
    province: z.string().trim().optional(),
    district: z.string().trim().optional(),
    ward: z.string().trim().optional(),
    isDefault: z.boolean().default(false),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateAddressSchema = z.object({
  params: addressIdParam,
  body: z.object({
    fullName: z.string().trim().min(2).optional(),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Số điện thoại không hợp lệ")
      .optional(),
    address: z.string().trim().min(10).optional(),
    province: z.string().trim().optional(),
    district: z.string().trim().optional(),
    ward: z.string().trim().optional(),
    isDefault: z.boolean().optional(),
  }),
  query: z.object({}).optional(),
});

export const addressIdSchema = z.object({
  params: addressIdParam,
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});
