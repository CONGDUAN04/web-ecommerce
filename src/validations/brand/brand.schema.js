import { z } from "zod";
import { idParam } from "../common/params.js";

const nameField = z
    .string({ required_error: "Tên thương hiệu không được để trống" })
    .min(1, "Tên thương hiệu không được để trống")
    .max(100, "Tên thương hiệu tối đa 100 ký tự")
    .trim();

export const createBrandSchema = z.object({
    body: z.object({
        name: nameField
    })
});

export const updateBrandSchema = z.object({
    params: idParam,
    body: z.object({
        name: nameField.optional(),
    })
});