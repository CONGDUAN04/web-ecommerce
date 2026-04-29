import { Router } from "express";

import {
  getProductGroups,
  getProductGroupById,
  createProductGroup,
  updateProductGroup,
  deleteProductGroup,
  updateProductGroupStatus,
} from "../../controllers/admin/productGroup.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  createProductGroupSchema,
  updateProductGroupSchema,
  getProductGroupsQuerySchema,
  updateProductGroupStatusSchema,
} from "../../validations/admin/productGroup.schema.js";

const router = Router();

router.get("/", validate(getProductGroupsQuerySchema), getProductGroups);

router.get("/:id", validate(idParamSchema), getProductGroupById);

router.post("/", validate(createProductGroupSchema), createProductGroup);

router.put("/:id", validate(updateProductGroupSchema), updateProductGroup);

router.delete("/:id", validate(idParamSchema), deleteProductGroup);

router.patch(
  "/:id/status",
  validate(updateProductGroupStatusSchema),
  updateProductGroupStatus,
);
export default router;
