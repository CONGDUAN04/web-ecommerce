import { z } from "zod";
import { idParam } from "./params.js";

const usernameField = z
  .string({ required_error: "Username không được để trống" })
  .min(1, "Username không được để trống")
  .max(255, "Username tối đa 255 ký tự")
  .email("Username phải là email hợp lệ")
  .trim()
  .toLowerCase();

const fullNameField = z
  .string({ required_error: "Họ tên không được để trống" })
  .min(1, "Họ tên không được để trống")
  .max(100, "Họ tên tối đa 100 ký tự")
  .trim();

const phoneField = z
  .string()
  .regex(
    /^(0|\+84)\d{9}$/,
    "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)",
  )
  .optional()
  .nullable();

const roleIdField = z.coerce
  .number({ required_error: "RoleId không được để trống" })
  .int()
  .positive("RoleId phải là số nguyên dương");
const urlField = z.string().url("Logo phải là URL hợp lệ").optional();

const publicIdField = z.string().optional();

export const createUserSchema = z.object({
  body: z.object({
    username: usernameField,
    fullName: fullNameField,
    phone: phoneField,
    roleId: roleIdField,
    avatar: urlField,
    avatarId: publicIdField,
  }),
});

export const updateUserSchema = z.object({
  params: idParam,
  body: z.object({
    fullName: fullNameField.optional(),
    phone: phoneField,
    roleId: roleIdField.optional().nullable(),
    avatar: urlField.optional(),
    avatarId: publicIdField.optional(),
  }),
});

export const updateUserStatusSchema = z.object({
  params: idParam,
  body: z.object({
    isActive: z.boolean(),
  }),
});
