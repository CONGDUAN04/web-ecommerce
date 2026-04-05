import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { uploadMultipleFiles } from "../../middleware/multer.js";
import {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview,
  createReply,
} from "../../controllers/client/review.controller.js";
import {
  getReviewsByProductSchema,
  createReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
  createReplySchema,
} from "../../validations/client/review.validation.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(validate(getReviewsByProductSchema), getReviewsByProduct)
  .post(
    uploadMultipleFiles("images", "images/review", 5),
    validate(createReviewSchema),
    createReview,
  );

router
  .route("/:reviewId")
  .put(
    uploadMultipleFiles("images", "images/review", 5),
    validate(updateReviewSchema),
    updateReview,
  )
  .delete(validate(deleteReviewSchema), deleteReview);

router.post("/:reviewId/replies", validate(createReplySchema), createReply);

export default router;
