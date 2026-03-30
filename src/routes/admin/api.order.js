import { Router } from "express";

import {
  getOrders,
  getOrderById,
  confirmOrder,
  shipOrder,
  completeOrder,
  cancelOrder,
  approveReturn,
  rejectReturn,
  completeReturn,
} from "../../controllers/admin/order.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  getOrdersSchema,
  shipOrderSchema,
  cancelOrderSchema,
  approveReturnSchema,
  rejectReturnSchema,
  completeReturnSchema,
} from "../../validations/admin/order.schema.js";

const router = Router();

// ── Danh sách & chi tiết ──────────────────────────
router.get("/", validate(getOrdersSchema), getOrders);
router.get("/:id", validate(idParamSchema), getOrderById);

// ── Lifecycle chính ───────────────────────────────
router.patch("/:id/confirm", validate(idParamSchema), confirmOrder);
router.patch("/:id/ship", validate(shipOrderSchema), shipOrder);
router.patch("/:id/complete", validate(idParamSchema), completeOrder);
router.patch("/:id/cancel", validate(cancelOrderSchema), cancelOrder);

// ── Return flow ───────────────────────────────────
router.patch(
  "/:id/return/approve",
  validate(approveReturnSchema),
  approveReturn,
);
router.patch("/:id/return/reject", validate(rejectReturnSchema), rejectReturn);
router.patch(
  "/:id/return/complete",
  validate(completeReturnSchema),
  completeReturn,
);

export default router;
