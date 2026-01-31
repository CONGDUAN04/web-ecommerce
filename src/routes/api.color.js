// routes/color.route.js
import express from "express";
import {
    getColors,
    createColor,
    updateColor,
    deleteColor
} from "../controllers/admin/color.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { validate } from "../middleware/validate.middleware.js"
import { paginationSchema } from "../validations/common/query.js";
import { uploadErrorHandler } from "../middleware/uploadErrorHandler.js";
import { createColorSchema, updateColorSchema } from "../validations/color/color.schema.js";
import { idParamSchema } from "../validations/common/params.js";

const router = express.Router();
router.get("/", validate(paginationSchema), getColors);
router.post("/", uploadSingleFile("image", "images/color"), uploadErrorHandler, validate(createColorSchema), createColor);
router.put(
    "/:id",
    uploadSingleFile("image", "images/color"),
    uploadErrorHandler,
    validate(updateColorSchema),
    updateColor
);
router.delete("/:id", validate(idParamSchema), deleteColor);

export default router;