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
} from "../../validations/voucher/voucher.schema.js";

const router = Router();

router.get("/", getVouchers);
router.get("/:id", getVoucherById);
router.get("/:id/usages", getVoucherUsages);
router.post("/", validate(createVoucherSchema), createVoucher);
router.patch("/:id", validate(updateVoucherSchema), updateVoucher);
router.delete("/:id", deleteVoucher);

export default router;