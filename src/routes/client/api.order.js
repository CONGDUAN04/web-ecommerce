import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from "../../controllers/client/order.controller.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createOrderSchema,
  getOrdersSchema,
  getOrderByIdSchema,
  cancelOrderSchema,
} from "../../validations/client/order.validation.js";

import {
  createReturnRequestSchema,
  getReturnRequestSchema,
} from "../../validations/client/return.validation.js";

import {
  createReturnRequest,
  getReturnRequest,
} from "../../controllers/client/return.controller.js";
const router = Router();

router.post("/", validate(createOrderSchema), createOrder);
router.get("/", validate(getOrdersSchema), getOrders);
router.get("/:id", validate(getOrderByIdSchema), getOrderById);
router.patch("/:id/cancel", validate(cancelOrderSchema), cancelOrder);

router.post(
  "/:id/return",
  validate(createReturnRequestSchema),
  createReturnRequest,
);

router.get("/:id/return", validate(getReturnRequestSchema), getReturnRequest);
export default router;
