import { Router } from "express";
import {
  getVouchers,
  getVoucherById,
  getVoucherUsages,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../../controllers/admin/voucher.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createVoucherSchema,
  updateVoucherSchema,
} from "../../validations/admin/voucher.schema.js";
import { paginationSchema } from "../../validations/admin/query.js";
import { idParamSchema } from "../../validations/admin/params.js";

const router = Router();

router.get("/", validate(paginationSchema), getVouchers);
router.get("/:id", validate(idParamSchema), getVoucherById);
router.get("/:id/usages", validate(idParamSchema), getVoucherUsages);
router.post("/", validate(createVoucherSchema), createVoucher);
router.patch("/:id", validate(updateVoucherSchema), updateVoucher);
router.delete("/:id", validate(idParamSchema), deleteVoucher);

export default router;
