import { Router } from "express";
import {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} from "../controllers/admin/brand.controller.js";

import { uploadSingleFile } from "../middleware/multer.js";
import { validate } from "../middleware/validate.middleware.js";
import { paginationSchema } from "../validations/common/query.js";
import { idParamSchema } from "../validations/common/params.js";
import { uploadErrorHandler } from "../middleware/uploadErrorHandler.js";

import {
    createBrandSchema,
    updateBrandSchema
} from "../validations/brand/brand.schema.js";

const router = Router();

router.get("/", validate(paginationSchema), getBrands);

router.get("/:id", validate(idParamSchema), getBrandById);

router.post(
    "/",
    uploadSingleFile("image", "images/brand"),
    uploadErrorHandler,
    validate(createBrandSchema),
    createBrand
);

router.put(
    "/:id",
    uploadSingleFile("image", "images/brand"),
    uploadErrorHandler,
    validate(updateBrandSchema),
    updateBrand
);

router.delete("/:id", validate(idParamSchema), deleteBrand);

export default router;