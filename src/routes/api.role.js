import { Router } from "express";
import {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
} from "../controllers/admin/role.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { checkValidJWT, isAdmin } from "../middleware/jwt.js";
import {
    createRoleSchema,
    updateRoleSchema,
} from "../validations/role/role.validation.js";
import { idParamSchema } from "../validations/common/params.js";
import { paginationSchema } from "../validations/common/query.js";
const router = Router();
router.use(checkValidJWT);
router.use(isAdmin);
router.get("/", validate(paginationSchema), getRoles);
router.get("/:id", validate(idParamSchema), getRoleById);
router.post("/", validate(createRoleSchema), createRole);
router.put("/:id", validate(updateRoleSchema), updateRole);
router.delete("/:id", validate(idParamSchema), deleteRole);

export default router;