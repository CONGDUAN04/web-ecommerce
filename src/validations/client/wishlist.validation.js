import { z } from "zod";
import { positiveInt } from "../admin/params.js";

export const addToWishlistSchema = z.object({
  body: z.object({
    productId: positiveInt,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const checkWishlistSchema = z.object({
  params: z.object({
    productId: positiveInt,
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const removeWishlistSchema = z.object({
  params: z.object({
    productId: positiveInt,
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});
