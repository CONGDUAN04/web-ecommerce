import { z } from "zod";
import { paginationSchema } from "../../validations/admin/query.js";

const slugParam = z.object({
  slug: z.string().min(1, "Slug không hợp lệ"),
});

export const getProductsSchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    groupId: z.string().optional(),
    storage: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    sort: z
      .enum([
        "newest",
        "oldest",
        "popular",
        "price-asc",
        "price-desc",
        "best-seller",
      ])
      .default("newest"),
  }),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const getProductBySlugSchema = z.object({
  params: slugParam,
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const searchProductsSchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    q: z.string().trim().optional(),
  }),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const getProductGroupsSchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
  }),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const getProductGroupBySlugSchema = z.object({
  params: slugParam,
  query: z.object({
    storage: z.string().optional(),
    color: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
  }),
  body: z.object({}).optional(),
});
