import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  searchProducts,
  getRelatedProducts,
  getProductGroups,
  getProductGroupBySlug,
} from "../../controllers/client/product.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  getProductsSchema,
  getProductBySlugSchema,
  searchProductsSchema,
  getProductGroupsSchema,
  getProductGroupBySlugSchema,
} from "../../validations/client/product.validation.js";
import reviewRoutes from "./api.review.js";

const router = Router();
router.use("/:productId/reviews", reviewRoutes);

// Products
router.get("/", validate(getProductsSchema), getProducts);
router.get("/search", validate(searchProductsSchema), searchProducts);
router.get("/groups", validate(getProductGroupsSchema), getProductGroups);
router.get(
  "/groups/:slug",
  validate(getProductGroupBySlugSchema),
  getProductGroupBySlug,
);

router.get("/:slug", validate(getProductBySlugSchema), getProductBySlug);
router.get(
  "/:slug/related",
  validate(getProductBySlugSchema),
  getRelatedProducts,
);

export default router;
