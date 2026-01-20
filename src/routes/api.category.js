import { Router } from "express";
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/admin/category.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { validate } from "../middleware/validate.middleware.js";
import { paginationSchema } from "../validations/common/query.js";
import { idParamSchema } from "../validations/common/params.js";
import { createCategorySchema } from "../validations/category/create.category.js";
import { updateCategorySchema } from "../validations/category/update.category.js";
import { uploadErrorHandler } from "../middleware/uploadErrorHandler.js";

const router = Router();

router.get("/", validate(paginationSchema), getCategories);

router.get("/:id", validate(idParamSchema), getCategoryById);

router.post(
    "/",
    uploadSingleFile("image", "images/category"),
    uploadErrorHandler,
    validate(createCategorySchema),
    createCategory
);

router.put(
    "/:id",
    uploadSingleFile("image", "images/category"),
    uploadErrorHandler,
    validate(updateCategorySchema),
    updateCategory
);

router.delete("/:id", validate(idParamSchema), deleteCategory);

export default router;