// routes/color.route.js
import express from "express";
import {
    getColors,
    getColorById,
    createColor,
    updateColor,
    deleteColor
} from "../controllers/admin/color.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema } from "../validations/common/params.js";
import { paginationSchema } from "../validations/common/query.js";
import { createColorSchema } from "../validations/color/create.color.js";
import { updateColorSchema } from "../validations/color/update.color.js";


const router = express.Router();

router.get("/", validate(paginationSchema), getColors);
router.get("/:id", validate(idParamSchema), getColorById);
router.post(
    "/",
    uploadSingleFile("image", "images/color"),
    validate(createColorSchema),
    createColor
);
router.put(
    "/:id",
    uploadSingleFile("image", "images/color"),
    validate(updateColorSchema),
    updateColor
);
router.delete("/:id", validate(idParamSchema), deleteColor);

export default router;