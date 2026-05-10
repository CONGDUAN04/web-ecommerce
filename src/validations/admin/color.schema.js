import { z } from "zod";

import { idParam } from "./params.js";

import { paginationSchema } from "./query.js";

const nameField = z
  .string({ required_error: "Tên màu không được để trống" })
  .trim()
  .min(1, "Tên màu không được để trống")
  .max(50, "Tên màu tối đa 50 ký tự");

const codeField = z
  .string({ required_error: "Mã màu không được để trống" })
  .trim()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Mã màu không hợp lệ");

export const createColorSchema = z.object({
  body: z.object({
    name: nameField,
    code: codeField,
  }),
});

export const updateColorSchema = z.object({
  params: idParam,

  body: z.object({
    name: nameField.optional(),
    code: codeField.optional(),
  }),
});

export const getColorsQuerySchema = paginationSchema.extend({
  query: paginationSchema.shape.query,

  params: z.object({}).optional(),

  body: z.object({}).optional(),
});
