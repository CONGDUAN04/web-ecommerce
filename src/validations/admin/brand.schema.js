import { z } from "zod";
import { idParam } from "./params.js";

const nameField = z
  .string({ required_error: "Tên thương hiệu không được để trống" })
  .trim()
  .min(1, "Tên thương hiệu không được để trống")
  .max(100, "Tên thương hiệu tối đa 100 ký tự");

const urlField = z.string().url("Logo phải là URL hợp lệ").optional();

const publicIdField = z.string().optional();

export const createBrandSchema = z.object({
  body: z.object({
    name: nameField,
    logo: urlField,
    logoId: publicIdField,
  }),
});

export const updateBrandSchema = z.object({
  params: idParam,
  body: z.object({
    name: nameField.optional(),
    logo: urlField.optional(),
    logoId: publicIdField.optional(),
  }),
});
