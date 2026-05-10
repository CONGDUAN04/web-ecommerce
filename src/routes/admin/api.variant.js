import { Router } from "express";

import {
  getVariants,
  getVariantById,
  getVariantsByProductId,
  createVariant,
  updateVariant,
  deleteVariant,
  updateVariantStatus,
} from "../../controllers/admin/variant.controller.js";

import { validate } from "../../middleware/validate.middleware.js";

import { idParamSchema } from "../../validations/admin/params.js";

import {
  createVariantSchema,
  updateVariantSchema,
  getVariantsQuerySchema,
  updateVariantStatusSchema,
} from "../../validations/admin/variant.schema.js";

const router = Router();

router.get("/", validate(getVariantsQuerySchema), getVariants);

router.get(
  "/by-product/:productId",
  validate(idParamSchema),
  getVariantsByProductId,
);

router.get("/:id", validate(idParamSchema), getVariantById);

router.post("/", validate(createVariantSchema), createVariant);

router.put("/:id", validate(updateVariantSchema), updateVariant);

router.delete("/:id", validate(idParamSchema), deleteVariant);

router.patch(
  "/:id/status",
  validate(updateVariantStatusSchema),
  updateVariantStatus,
);
export default router;
