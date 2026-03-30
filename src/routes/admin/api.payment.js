import { Router } from "express";
import {
  getPayments,
  getPaymentById,
  confirmBanking,
} from "../../controllers/admin/payment.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  getPaymentsSchema,
  confirmBankingSchema,
} from "../../validations/admin/payment.schema.js";

const router = Router();

router.get("/", validate(getPaymentsSchema), getPayments);
router.get("/:id", validate(idParamSchema), getPaymentById);
router.patch(
  "/:id/confirm-banking",
  validate(confirmBankingSchema),
  confirmBanking,
);

export default router;
