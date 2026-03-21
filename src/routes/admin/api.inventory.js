import { Router } from "express";
import { adjustInventory, exportInventory, getInventoryLogs, importInventory } from "../../controllers/admin/inventory.controller.js";
import { validate } from "../../middleware/validate.middleware.js"
import { adjustInventorySchema, inventorySchema } from "../../validations/inventory/inventory.schema.js";
const router = Router();

router.post("/import", validate(inventorySchema), importInventory);
router.post("/export", validate(inventorySchema), exportInventory);
router.post("/adjust", validate(adjustInventorySchema), adjustInventory);
router.get("/logs", getInventoryLogs);

export default router;
