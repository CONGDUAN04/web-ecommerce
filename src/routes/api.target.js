import { Router } from "express";
import {
    getTargets,
    getTargetById,
    createTarget,
    updateTarget,
    deleteTarget
} from "../controllers/admin/target.controller.js";
import { paginationSchema } from "../validations/common/query.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema } from "../validations/common/params.js";
import { createTargetSchema } from "../validations/target/create.target.js";
import { updateTargetSchema } from "../validations/target/update.target.js";

const router = Router();

router.get("/", validate(paginationSchema), getTargets);
router.get("/:id", validate(idParamSchema), getTargetById);
router.post("/", validate(createTargetSchema), createTarget);
router.put("/:id", validate(updateTargetSchema), updateTarget);
router.delete("/:id", validate(idParamSchema), deleteTarget);

export default router;
