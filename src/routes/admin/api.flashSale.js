import { Router } from "express";
import {
  getFlashSales,
  getFlashSaleById,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
  addFlashSaleItems,
  updateFlashSaleItem,
  deleteFlashSaleItem,
} from "../../controllers/admin/flashSale.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { paginationSchema } from "../../validations/admin/query.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  createFlashSaleSchema,
  updateFlashSaleSchema,
  addFlashSaleItemsSchema,
  updateFlashSaleItemSchema,
  deleteFlashSaleItemSchema,
} from "../../validations/admin/flashSale.schema.js";

const router = Router();

router.get("/", validate(paginationSchema), getFlashSales);

router.get("/:id", validate(idParamSchema), getFlashSaleById);

router.post("/", validate(createFlashSaleSchema), createFlashSale);

router.put("/:id", validate(updateFlashSaleSchema), updateFlashSale);

router.delete("/:id", validate(idParamSchema), deleteFlashSale);

router.post("/:id/items", validate(addFlashSaleItemsSchema), addFlashSaleItems);

router.put(
  "/:id/items/:itemId",
  validate(updateFlashSaleItemSchema),
  updateFlashSaleItem,
);

router.delete(
  "/:id/items/:itemId",
  validate(deleteFlashSaleItemSchema),
  deleteFlashSaleItem,
);

export default router;
