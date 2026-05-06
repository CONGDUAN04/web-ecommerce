import { Router } from "express";

import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../../controllers/admin/product.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
  updateProductStatusSchema,
} from "../../validations/admin/product.schema.js";

import { uploadSingleFile } from "../../middleware/multer.js";

const router = Router();

router.get("/", validate(getProductsQuerySchema), getProducts);

router.get("/slug/:slug", getProductBySlug);

router.get("/:id", validate(idParamSchema), getProductById);

router.post("/", validate(createProductSchema), createProduct);

router.put("/:id", validate(updateProductSchema), updateProduct);

router.delete("/:id", validate(idParamSchema), deleteProduct);

router.patch(
  "/:id/status",
  validate(updateProductStatusSchema),
  updateProductStatus,
);
export default router;
