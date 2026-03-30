import { Router } from "express";

import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/admin/product.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} from "../../validations/admin/product.schema.js";
import { uploadSingleFile } from "../../middleware/multer.js";

const router = Router();

// GET /admin/products?page=1&limit=10&groupId=1&brandId=1&categoryId=1&search=iphone
router.get("/", validate(getProductsQuerySchema), getProducts);

// GET /admin/products/slug/:slug  — dùng cho client (trang chi tiết)
router.get("/slug/:slug", getProductBySlug);

// GET /admin/products/:id
router.get("/:id", validate(idParamSchema), getProductById);

// POST /admin/products
router.post(
  "/",
  uploadSingleFile("thumbnail", "images/product"),
  validate(createProductSchema),
  createProduct,
);

// PUT /admin/products/:id
router.put(
  "/:id",
  uploadSingleFile("thumbnail", "images/product"),
  validate(updateProductSchema),
  updateProduct,
);

// DELETE /admin/products/:id
router.delete("/:id", validate(idParamSchema), deleteProduct);

export default router;
