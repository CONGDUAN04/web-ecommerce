import { Router } from "express";

import {
  getInventoryLogs,
  getInventoryLogById,
  getInventorySummary,
  createInventoryLog,
} from "../../controllers/admin/inventory.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { paginationSchema } from "../../validations/admin/query.js";
import {
  inventoryQuerySchema,
  inventoryIdParamSchema,
  createInventoryLogSchema,
} from "../../validations/admin/inventory.schema.js";

const router = Router();

// GET  /api/admin/inventory/summary
router.get("/summary", validate(paginationSchema), getInventorySummary);

// GET  /api/admin/inventory
router.get("/", validate(inventoryQuerySchema), getInventoryLogs);

// GET  /api/admin/inventory/:id
router.get("/:id", validate(inventoryIdParamSchema), getInventoryLogById);

// POST /api/admin/inventory
router.post("/", validate(createInventoryLogSchema), createInventoryLog);

export default router;
