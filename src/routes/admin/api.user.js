import { Router } from "express";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from "../../controllers/admin/user.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { paginationSchema } from "../../validations/admin/query.js";
import { idParamSchema } from "../../validations/admin/params.js";
import {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from "../../validations/admin/user.schema.js";

const router = Router();

router.get("/", validate(paginationSchema), getUsers);

router.get("/:id", validate(idParamSchema), getUserById);

router.post("/", validate(createUserSchema), createUser);

router.put("/:id", validate(updateUserSchema), updateUser);

router.delete("/:id", validate(idParamSchema), deleteUser);

router.patch("/:id/status", validate(updateUserStatusSchema), updateUserStatus);

export default router;
