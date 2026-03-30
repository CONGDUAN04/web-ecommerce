import { Router } from "express";

import {
  getVariants,
  getVariantById,
  getVariantsByProductId,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../../controllers/admin/variant.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  createVariantSchema,
  updateVariantSchema,
  getVariantsQuerySchema,
} from "../../validations/admin/variant.schema.js";

const router = Router();

// GET /admin/variants?page=1&limit=10&productId=1&storage=256&color=Cam Vũ Trụ
router.get("/", validate(getVariantsQuerySchema), getVariants);

// GET /admin/variants/by-product/:productId
// Trả về { variants[], storages[], colors[] } để render selector
router.get("/by-product/:productId", getVariantsByProductId);

// GET /admin/variants/:id
router.get("/:id", validate(idParamSchema), getVariantById);

// POST /admin/variants
router.post("/", validate(createVariantSchema), createVariant);

// PUT /admin/variants/:id
router.put("/:id", validate(updateVariantSchema), updateVariant);

// DELETE /admin/variants/:id
router.delete("/:id", validate(idParamSchema), deleteVariant);

export default router;
