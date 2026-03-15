import { Router } from "express";
import {
    createProductGroup,
    deleteProductGroup,
    getProductGroupById,
    getProductGroups,
    updateProductGroup
} from "../controllers/admin/productGroup.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { paginationSchema } from "../validations/common/query.js";
import { idParamSchema } from "../validations/common/params.js";
import { createProductGroupSchema, updateProductGroupSchema } from "../validations/productGroup/productGroup.schema.js";


const router = Router();

router.get("/", validate(paginationSchema), getProductGroups);

router.get("/:id", validate(idParamSchema), getProductGroupById);

router.post("/", validate(createProductGroupSchema), createProductGroup);

router.put("/:id", validate(updateProductGroupSchema), updateProductGroup);

router.delete("/:id", validate(idParamSchema), deleteProductGroup);

export default router;