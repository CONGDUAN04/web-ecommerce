import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getReviewsByProductServices,
  createReviewServices,
  updateReviewServices,
  deleteReviewServices,
  createReplyServices,
  deleteReplyServices,
} from "../../services/client/review.services.js";

export const getReviewsByProduct = asyncHandler(async (req, res) => {
  const result = await getReviewsByProductServices(
    req.validated.params.productId,
    req.validated.query,
  );
  return ApiResponse.success(res, result.items, {
    meta: { ...result.pagination, stats: result.stats },
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await createReviewServices(
    req.user.id,
    req.validated.params.productId,
    req.validated.body,
    req.files,
  );
  return ApiResponse.created(res, review, "Đánh giá thành công");
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await updateReviewServices(
    req.user.id,
    req.validated.params.reviewId,
    req.validated.body,
    req.files,
  );
  return ApiResponse.updated(res, review, "Cập nhật đánh giá thành công");
});

export const deleteReview = asyncHandler(async (req, res) => {
  await deleteReviewServices(req.user.id, req.validated.params.reviewId);
  return ApiResponse.deleted(res, "Xóa đánh giá thành công");
});

export const createReply = asyncHandler(async (req, res) => {
  const reply = await createReplyServices(
    req.user.id,
    req.validated.params.reviewId,
    req.validated.body,
  );
  return ApiResponse.created(res, reply, "Trả lời thành công");
});

export const deleteReply = asyncHandler(async (req, res) => {
  await deleteReplyServices(req.user.id, req.validated.params.replyId);
  return ApiResponse.deleted(res, "Xóa trả lời thành công");
});
