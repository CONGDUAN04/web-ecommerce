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

const router = Router();

// Products
router.get("/", validate(getProductsSchema), getProducts);
router.get("/search", validate(searchProductsSchema), searchProducts);
router.get("/:slug", validate(getProductBySlugSchema), getProductBySlug);
router.get(
  "/:slug/related",
  validate(getProductBySlugSchema),
  getRelatedProducts,
);

// Product Groups
router.get("/groups", validate(getProductGroupsSchema), getProductGroups);
router.get(
  "/groups/:slug",
  validate(getProductGroupBySlugSchema),
  getProductGroupBySlug,
);

export default router;
