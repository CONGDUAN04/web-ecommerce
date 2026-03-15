import { Router } from "express";

import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/admin/category.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { paginationSchema } from "../validations/common/query.js";
import { idParamSchema } from "../validations/common/params.js";
import {
    createCategorySchema,
    updateCategorySchema
} from "../validations/category/category.schema.js";

const router = Router();

router.get("/", validate(paginationSchema), getCategories);

router.get("/:id", validate(idParamSchema), getCategoryById);

router.post("/", validate(createCategorySchema), createCategory);

router.put("/:id", validate(updateCategorySchema), updateCategory);

router.delete("/:id", validate(idParamSchema), deleteCategory);

export default router;