import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../../controllers/client/wishlist.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  addToWishlistSchema,
  checkWishlistSchema,
  removeWishlistSchema,
} from "../../validations/client/wishlist.validation.js";

const router = Router();

// GET /api/v1/wishlist
router.get("/", getWishlist);

// POST /api/v1/wishlist
router.post("/", validate(addToWishlistSchema), addToWishlist);

// DELETE /api/v1/wishlist/:productId
router.delete(
  "/:productId",
  validate(removeWishlistSchema),
  removeFromWishlist,
);

// GET /api/v1/wishlist/:productId -> check if product is in wishlist
router.get("/:productId", validate(checkWishlistSchema), checkWishlist);

export default router;
