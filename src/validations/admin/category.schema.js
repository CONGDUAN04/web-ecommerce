import { z } from "zod";
import { idParam } from "./params.js";

const nameField = z
  .string({ required_error: "Tên danh mục không được để trống" })
  .trim()
  .min(1, "Tên danh mục không được để trống")
  .max(100, "Tên danh mục tối đa 100 ký tự");
const urlField = z.string().url("Icon phải là URL hợp lệ").optional();
const publicIdField = z.string().optional();
export const createCategorySchema = z.object({
  body: z.object({
    name: nameField,
    icon: urlField,
    iconId: publicIdField,
  }),
});

export const updateCategorySchema = z.object({
  params: idParam,
  body: z.object({
    name: nameField.optional(),
    icon: urlField.optional(),
    iconId: publicIdField.optional(),
  }),
});
