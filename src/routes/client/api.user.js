import { Router } from "express";
import {
  fetchAccount,
  updateMyProfile,
  changePassword,
} from "../../controllers/client/user.controller.js";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../controllers/client/address.controller.js";

import { validate } from "../../middleware/validate.middleware.js";

import {
  updateProfileSchema,
  changePasswordSchema,
} from "../../validations/client/user.validation.js";

import {
  createAddressSchema,
  updateAddressSchema,
  addressIdSchema,
} from "../../validations/client/address.validation.js";
import { uploadSingleFile } from "../../middleware/multer.js";
const router = Router();

// ===== USER =====
router.get("/", fetchAccount);
router.patch(
  "/",
  uploadSingleFile("avatar", "images/avatars"),
  validate(updateProfileSchema),
  updateMyProfile,
);
router.patch("/password", validate(changePasswordSchema), changePassword);

// ===== ADDRESS =====
router.get("/addresses", getAddresses);
router.post("/addresses", validate(createAddressSchema), createAddress);
router.patch("/addresses/:id", validate(updateAddressSchema), updateAddress);
router.delete("/addresses/:id", validate(addressIdSchema), deleteAddress);

export default router;
