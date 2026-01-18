import { Router } from "express";
import {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} from "../controllers/admin/brand.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { cleanupFile } from "../middleware/cleanupFile.js";
import { validate } from "../middleware/validate.middleware.js";
import { paginationSchema } from "../validations/common/query.js";
import { idParamSchema } from "../validations/common/params.js";
import { createBrandSchema } from "../validations/brand/create.brand.js";
import { updateBrandSchema } from "../validations/brand/update.brand.js";

const router = Router();

router.get("/", validate(paginationSchema), getBrands);

router.get("/:id", validate(idParamSchema), getBrandById);

router.post(
    "/",
    uploadSingleFile("image", "images/brand"),
    validate(createBrandSchema),
    cleanupFile,
    createBrand
);

router.put(
    "/:id",
    uploadSingleFile("image", "images/brand"),
    validate(updateBrandSchema),
    cleanupFile,
    updateBrand
);

router.delete("/:id", validate(idParamSchema), deleteBrand);

export default router;