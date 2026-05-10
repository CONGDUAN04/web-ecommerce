import { Router } from "express";

import {
  getProductColors,
  getProductColorById,
  createProductColor,
  updateProductColor,
  deleteProductColor,
} from "../../controllers/admin/productColor.controller.js";

import { validate } from "../../middleware/validate.middleware.js";

import { idParamSchema } from "../../validations/admin/params.js";

import {
  createProductColorSchema,
  updateProductColorSchema,
  getProductColorsQuerySchema,
} from "../../validations/admin/productColor.schema.js";

const router = Router();

router.get("/", validate(getProductColorsQuerySchema), getProductColors);

router.get("/:id", validate(idParamSchema), getProductColorById);

router.post("/", validate(createProductColorSchema), createProductColor);

router.put("/:id", validate(updateProductColorSchema), updateProductColor);

router.delete("/:id", validate(idParamSchema), deleteProductColor);

export default router;
