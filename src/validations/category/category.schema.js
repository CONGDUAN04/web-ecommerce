import { z } from "zod";
import { idParam } from "../common/params.js";

const nameField = z
    .string({ required_error: "Tên danh mục không được để trống" })
    .min(1, "Tên danh mục không được để trống")
    .max(100, "Tên danh mục tối đa 100 ký tự")
    .trim();

export const createCategorySchema = z.object({
    body: z.object({
        name: nameField
    })
});


export const updateCategorySchema = z.object({
    params: idParam,
    body: z.object({
        name: nameField
    })
});