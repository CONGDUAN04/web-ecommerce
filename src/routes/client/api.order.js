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

const router = Router();

router.post("/", validate(createOrderSchema), createOrder);
router.get("/", validate(getOrdersSchema), getOrders);
router.get("/:id", validate(getOrderByIdSchema), getOrderById);
router.patch("/:id/cancel", validate(cancelOrderSchema), cancelOrder);

export default router;
