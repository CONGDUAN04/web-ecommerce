import { Router } from "express";
import {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
} from "../controllers/admin/role.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { paginationSchema } from "../validations/common/query.js";
import { idParamSchema } from "../validations/common/params.js";
import { createRoleSchema } from "../validations/role/create.role.js";
import { updateRoleSchema } from "../validations/role/update.role.js";

const router = Router();

router.get("/", validate(paginationSchema), getRoles);

router.get("/:id", validate(idParamSchema), getRoleById);

router.post("/", validate(createRoleSchema), createRole);

router.put("/:id", validate(updateRoleSchema), updateRole);

router.delete("/:id", validate(idParamSchema), deleteRole);

export default router;
