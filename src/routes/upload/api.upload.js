import { Router } from "express";
import { uploadAuth } from "../../middleware/uploadAuth.middleware.js";
import {
  getUploadSignature,
  deleteFile,
} from "../../controllers/upload/upload.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { uploadSignatureSchema } from "../../validations/upload/upload.schema.js";
const router = Router();

router.post(
  "/signature",
  validate(uploadSignatureSchema),
  uploadAuth,
  getUploadSignature,
);
router.delete("/file", deleteFile);

export default router;
