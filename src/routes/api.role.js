import { Router } from "express";
import { getRoles } from "../controllers/admin/user.controller.js";

const router = Router();
router.get("/", getRoles);

export default router;
