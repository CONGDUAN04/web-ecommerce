// src/routes/admin/color.route.js

import { Router } from "express";

import {
  getColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
} from "../../controllers/admin/color.controller.js";

import { validate } from "../../middleware/validate.middleware.js";

import { idParamSchema } from "../../validations/admin/params.js";
import { paginationSchema } from "../../validations/admin/query.js";

import {
  createColorSchema,
  updateColorSchema,
} from "../../validations/admin/color.schema.js";

const router = Router();

router.get("/", validate(paginationSchema), getColors);

router.get("/:id", validate(idParamSchema), getColorById);

router.post("/", validate(createColorSchema), createColor);

router.put("/:id", validate(updateColorSchema), updateColor);

router.delete("/:id", validate(idParamSchema), deleteColor);

export default router;
