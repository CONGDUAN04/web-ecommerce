import { Router } from "express";

import {
    getProductGroups,
    getProductGroupById,
    createProductGroup,
    updateProductGroup,
    deleteProductGroup
} from "../controllers/admin/productGroup.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema } from "../validations/common/params.js";
import {
    createProductGroupSchema,
    updateProductGroupSchema,
    getProductGroupsQuerySchema
} from "../validations/productGroup/productGroup.schema.js";

const router = Router();

// GET /admin/product-groups?page=1&limit=10&series=iPhone 17&brandId=1
router.get("/", validate(getProductGroupsQuerySchema), getProductGroups);

// GET /admin/product-groups/:id
router.get("/:id", validate(idParamSchema), getProductGroupById);

// POST /admin/product-groups
router.post("/", validate(createProductGroupSchema), createProductGroup);

// PUT /admin/product-groups/:id
router.put("/:id", validate(updateProductGroupSchema), updateProductGroup);

// DELETE /admin/product-groups/:id
router.delete("/:id", validate(idParamSchema), deleteProductGroup);

export default router;