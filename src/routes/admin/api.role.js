import { Router } from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../../controllers/admin/role.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createRoleSchema,
  updateRoleSchema,
} from "../../validations/admin/role.schema.js";
import { idParamSchema } from "../../validations/admin/params.js";
import { paginationSchema } from "../../validations/admin/query.js";
const router = Router();
router.get("/", validate(paginationSchema), getRoles);
router.get("/:id", validate(idParamSchema), getRoleById);
router.post("/", validate(createRoleSchema), createRole);
router.put("/:id", validate(updateRoleSchema), updateRole);
router.delete("/:id", validate(idParamSchema), deleteRole);

export default router;
