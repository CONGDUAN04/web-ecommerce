import { Router } from "express";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/admin/user.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { uploadSingleFile } from "../../middleware/multer.js";
import { paginationSchema } from "../../validations/admin/query.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../../validations/admin/user.schema.js";

const router = Router();

// GET    /api/admin/users
router.get("/", validate(paginationSchema), getUsers);

// GET    /api/admin/users/:id
router.get("/:id", validate(idParamSchema), getUserById);

// POST   /api/admin/users
router.post(
  "/",
  uploadSingleFile("avatar", "images/avatar"),
  validate(createUserSchema),
  createUser,
);

// PUT    /api/admin/users/:id
router.put(
  "/:id",
  uploadSingleFile("avatar", "images/avatar"),
  validate(updateUserSchema),
  updateUser,
);

// DELETE /api/admin/users/:id
router.delete("/:id", validate(idParamSchema), deleteUser);

export default router;
