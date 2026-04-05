import { z } from "zod";

const productIdParam = z.object({
  productId: z.coerce.number().int().positive("productId không hợp lệ"),
});

const reviewIdParam = z.object({
  reviewId: z.coerce.number().int().positive("reviewId không hợp lệ"),
});

const replyIdParam = z.object({
  replyId: z.coerce.number().int().positive("replyId không hợp lệ"),
});

const ratingField = z.coerce
  .number({ required_error: "Rating không được để trống" })
  .int("Rating phải là số nguyên")
  .min(1, "Rating tối thiểu là 1")
  .max(5, "Rating tối đa là 5");

const commentField = z
  .string()
  .max(2000, "Bình luận tối đa 2000 ký tự")
  .trim()
  .optional();

// GET /api/products/:productId/reviews
export const getReviewsByProductSchema = z.object({
  params: productIdParam,
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(50).optional().default(10),
      rating: z.coerce.number().int().min(1).max(5).optional(),
      sort: z
        .enum(["newest", "oldest", "rating_asc", "rating_desc"])
        .optional()
        .default("newest"),
    })
    .optional()
    .default({}),
});

// POST /api/products/:productId/reviews
export const createReviewSchema = z.object({
  params: productIdParam,
  body: z.object({
    rating: ratingField,
    comment: commentField,
  }),
});

// PUT /api/products/:productId/reviews/:reviewId
export const updateReviewSchema = z.object({
  params: productIdParam.merge(reviewIdParam),
  body: z
    .object({
      rating: ratingField.optional(),
      comment: commentField,
    })
    .refine((data) => data.rating !== undefined || data.comment !== undefined, {
      message: "Cần ít nhất một trường để cập nhật",
    }),
});

// DELETE /api/products/:productId/reviews/:reviewId
export const deleteReviewSchema = z.object({
  params: productIdParam.merge(reviewIdParam),
});

// POST /api/products/:productId/reviews/:reviewId/replies
export const createReplySchema = z.object({
  params: productIdParam.merge(reviewIdParam),
  body: z.object({
    comment: z
      .string({ required_error: "Nội dung reply không được để trống" })
      .min(1, "Nội dung reply không được để trống")
      .max(1000, "Reply tối đa 1000 ký tự")
      .trim(),
  }),
});

// DELETE /api/replies/:replyId
export const deleteReplySchema = z.object({
  params: replyIdParam,
});
