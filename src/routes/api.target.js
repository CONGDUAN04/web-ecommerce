import { Router } from "express";
import { getTarget, createTarget, updateTarget, getTargetById, deleteTarget } from "../controllers/admin/target.controller.js";

const router = Router();

router.get("/", getTarget);
router.get("/:id", getTargetById);
router.post("/", createTarget);
router.put("/:id", updateTarget);
router.delete("/:id", deleteTarget);

export default router;
