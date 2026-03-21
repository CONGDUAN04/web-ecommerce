import { Router } from "express";

import {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} from "../../controllers/admin/brand.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { uploadSingleFile } from "../../middleware/multer.js";
import { paginationSchema } from "../../validations/common/query.js";
import { idParamSchema } from "../../validations/common/params.js";
import {
    createBrandSchema,
    updateBrandSchema
} from "../../validations/brand/brand.schema.js";

const router = Router();

// GET    /api/admin/brands
router.get("/", validate(paginationSchema), getBrands);

// GET    /api/admin/brands/:id
router.get("/:id", validate(idParamSchema), getBrandById);

// POST   /api/admin/brands
router.post(
    "/",
    uploadSingleFile("logo", "images/brand"),
    validate(createBrandSchema),
    createBrand
);

// PUT    /api/admin/brands/:id
router.put(
    "/:id",
    uploadSingleFile("logo", "images/brand"),
    validate(updateBrandSchema),
    updateBrand
);

// DELETE /api/admin/brands/:id
router.delete("/:id", validate(idParamSchema), deleteBrand);

export default router;