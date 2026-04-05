import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { uploadMultipleFiles } from "../../middleware/multer.js";
import {
  getReviewsByProduct,
  createReview,
} from "../../controllers/client/review.controller.js";
import {
  getReviewsByProductSchema,
  createReviewSchema,
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

export default router;
