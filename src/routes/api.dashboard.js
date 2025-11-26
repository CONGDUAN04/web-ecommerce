import { Router } from "express";
import { getAllDashboard } from "../controllers/admin/dashboard.controller.js";

const router = Router();
router.get("/", getAllDashboard);

export default router;
