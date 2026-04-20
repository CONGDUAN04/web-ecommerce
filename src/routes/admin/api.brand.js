import { Router } from "express";
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../controllers/admin/brand.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  createBrandSchema,
  updateBrandSchema,
} from "../../validations/admin/brand.schema.js";
import { paginationSchema } from "../../validations/admin/query.js";
const router = Router();

router.get("/", validate(paginationSchema), getBrands);
router.get("/:id", validate(idParamSchema), getBrandById);
router.post("/", validate(createBrandSchema), createBrand);
router.put("/:id", validate(updateBrandSchema), updateBrand);
router.delete("/:id", validate(idParamSchema), deleteBrand);

export default router;
