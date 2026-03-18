import { z } from "zod";
import { idParam } from "../common/params.js";

export const createVoucherSchema = z.object({
    body: z
        .object({
            code: z
                .string({ required_error: "Mã voucher không được để trống" })
                .min(3, "Mã voucher tối thiểu 3 ký tự")
                .max(50, "Mã voucher tối đa 50 ký tự")
                .trim()
                .toUpperCase(),

            type: z.enum(["PERCENT", "FIXED"], {
                errorMap: () => ({
                    message: "Loại voucher phải là PERCENT hoặc FIXED",
                }),
            }),

            discount: z
                .number({
                    required_error: "Giá trị giảm không được để trống",
                    invalid_type_error: "Giá trị giảm phải là số",
                })
                .positive("Giá trị giảm phải lớn hơn 0"),

            maxDiscount: z
                .number({ invalid_type_error: "Giảm tối đa phải là số" })
                .positive("Giảm tối đa phải lớn hơn 0")
                .optional()
                .nullable(),

            minOrderValue: z
                .number({ invalid_type_error: "Giá trị đơn tối thiểu phải là số" })
                .positive("Giá trị đơn tối thiểu phải lớn hơn 0")
                .optional()
                .nullable(),

            startDate: z
                .string({ required_error: "Ngày bắt đầu không được để trống" })
                .datetime("Ngày bắt đầu không hợp lệ (ISO 8601)"),

            endDate: z
                .string({ required_error: "Ngày kết thúc không được để trống" })
                .datetime("Ngày kết thúc không hợp lệ (ISO 8601)"),

            usageLimit: z
                .number({ invalid_type_error: "Giới hạn sử dụng phải là số" })
                .int("Giới hạn sử dụng phải là số nguyên")
                .positive("Giới hạn sử dụng phải lớn hơn 0")
                .optional()
                .nullable(),

            usagePerUser: z
                .number({ invalid_type_error: "Giới hạn mỗi user phải là số" })
                .int("Giới hạn mỗi user phải là số nguyên")
                .positive("Giới hạn mỗi user phải lớn hơn 0")
                .optional()
                .nullable(),
        })
        // Refine 1: startDate phải trước endDate
        .refine(
            (data) => new Date(data.startDate) < new Date(data.endDate),
            {
                message: "Ngày bắt đầu phải trước ngày kết thúc",
                path: ["endDate"],
            }
        )
        // Refine 2: nếu type là PERCENT thì discount phải từ 1-100
        .refine(
            (data) => {
                if (data.type === "PERCENT") {
                    return data.discount >= 1 && data.discount <= 100;
                }
                return true;
            },
            {
                message: "Phần trăm giảm phải từ 1 đến 100",
                path: ["discount"],
            }
        ),

    params: z.object({}).optional(),
    query: z.object({}).optional(),
});



export const updateVoucherSchema = z.object({
    params: idParam,

    body: z
        .object({
            maxDiscount: z
                .number({ invalid_type_error: "Giảm tối đa phải là số" })
                .positive("Giảm tối đa phải lớn hơn 0")
                .optional()
                .nullable(),

            minOrderValue: z
                .number({ invalid_type_error: "Giá trị đơn tối thiểu phải là số" })
                .positive("Giá trị đơn tối thiểu phải lớn hơn 0")
                .optional()
                .nullable(),

            startDate: z
                .string()
                .datetime("Ngày bắt đầu không hợp lệ")
                .optional(),

            endDate: z
                .string()
                .datetime("Ngày kết thúc không hợp lệ")
                .optional(),

            usageLimit: z
                .number({ invalid_type_error: "Giới hạn sử dụng phải là số" })
                .int("Giới hạn sử dụng phải là số nguyên")
                .positive("Giới hạn sử dụng phải lớn hơn 0")
                .optional()
                .nullable(),

            usagePerUser: z
                .number({ invalid_type_error: "Giới hạn mỗi user phải là số" })
                .int("Giới hạn mỗi user phải là số nguyên")
                .positive("Giới hạn mỗi user phải lớn hơn 0")
                .optional()
                .nullable(),

            isActive: z.boolean().optional(),
        })
        // Refine: chỉ validate startDate < endDate khi cả hai được gửi lên
        .refine(
            (data) => {
                if (data.startDate && data.endDate) {
                    return new Date(data.startDate) < new Date(data.endDate);
                }
                return true;
            },
            {
                message: "Ngày bắt đầu phải trước ngày kết thúc",
                path: ["endDate"],
            }
        )
        .optional(),

    query: z.object({}).optional(),
});