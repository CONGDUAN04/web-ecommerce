import { z } from "zod";
import { idParam } from "./params.js";

const VALID_ACTIONS = ["IMPORT", "EXPORT", "ADJUST"];

// ── Shared fields ────────────────────────────────────────────────────────────

const variantIdField = z
  .union([z.string(), z.number()])
  .transform((v) => Number(v))
  .refine((v) => Number.isInteger(v) && v > 0, {
    message: "variantId phải là số nguyên dương",
  });

const actionField = z.enum(["IMPORT", "EXPORT", "ADJUST"], {
  required_error: "Loại hành động không được để trống",
  invalid_type_error: `Hành động phải là một trong: ${VALID_ACTIONS.join(", ")}`,
});

const quantityField = z
  .union([z.string(), z.number()])
  .transform((v) => Number(v))
  .refine((v) => Number.isInteger(v) && v > 0, {
    message: "Số lượng phải là số nguyên dương",
  });

const noteField = z
  .string()
  .max(500, "Ghi chú tối đa 500 ký tự")
  .trim()
  .optional();

// ── Schemas ──────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/inventory
 * Tạo phiếu nhập / xuất / điều chỉnh kho
 */
export const createInventoryLogSchema = z.object({
  body: z.object({
    variantId: variantIdField,
    action: actionField,
    quantity: quantityField,
    note: noteField,
  }),
});

/**
 * GET /api/admin/inventory
 * Lấy danh sách log kho với phân trang & bộ lọc
 */
export const inventoryQuerySchema = z.object({
  query: z.object({
    page: z
      .union([z.string(), z.number()])
      .transform((v) => Number(v))
      .refine((v) => v >= 1, { message: "page phải >= 1" })
      .optional()
      .default(1),
    limit: z
      .union([z.string(), z.number()])
      .transform((v) => Number(v))
      .refine((v) => v >= 1 && v <= 100, { message: "limit từ 1 – 100" })
      .optional()
      .default(10),
    variantId: z
      .union([z.string(), z.number()])
      .transform((v) => Number(v))
      .refine((v) => Number.isInteger(v) && v > 0)
      .optional(),
    action: z.enum(["IMPORT", "EXPORT", "ADJUST"]).optional(),
    startDate: z
      .string()
      .datetime({ message: "startDate phải là ISO 8601" })
      .optional(),
    endDate: z
      .string()
      .datetime({ message: "endDate phải là ISO 8601" })
      .optional(),
  }),
});

/**
 * GET /api/admin/inventory/:id
 */
export const inventoryIdParamSchema = z.object({
  params: idParam,
});
