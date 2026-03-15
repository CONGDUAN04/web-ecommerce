import { Router } from "express";

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/admin/user.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { uploadErrorHandler } from "../middleware/uploadErrorHandler.js";
import { paginationSchema } from "../validations/common/query.js";
import { idParamSchema } from "../validations/common/params.js";
import {
    createUserSchema,
    updateUserSchema
} from "../validations/user/user.schema.js";

const router = Router();

// GET    /api/admin/users
router.get("/", validate(paginationSchema), getUsers);

// GET    /api/admin/users/:id
router.get("/:id", validate(idParamSchema), getUserById);

// POST   /api/admin/users
router.post(
    "/",
    uploadSingleFile("avatar", "images/avatar"),
    uploadErrorHandler,
    validate(createUserSchema),
    createUser
);

// PUT    /api/admin/users/:id
router.put(
    "/:id",
    uploadSingleFile("avatar", "images/avatar"),
    uploadErrorHandler,
    validate(updateUserSchema),
    updateUser
);

// DELETE /api/admin/users/:id
router.delete("/:id", validate(idParamSchema), deleteUser);

export default router;