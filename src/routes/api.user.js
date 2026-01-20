import express from "express";
import { validate } from "../middleware/validate.middleware.js";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getRoles,
} from "../controllers/admin/user.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { idParamSchema } from "../validations/common/params.js";
import { paginationSchema } from "../validations/common/query.js";
import { updateUserSchema } from "../validations/user/update.user.js";
import { createUserSchema } from "../validations/user/create.user.js";
import { uploadErrorHandler } from "../middleware/uploadErrorHandler.js";

const router = express.Router();

router.post(
    "/",
    uploadSingleFile("avatar", "images/avatar"),
    uploadErrorHandler,
    validate(createUserSchema),
    createUser
);

router.get("/", validate(paginationSchema), getUsers);

router.get("/roles", getRoles);

router.get("/:id", validate(idParamSchema), getUserById);

router.put(
    "/:id",
    uploadSingleFile("avatar", "images/avatar"),
    uploadErrorHandler,
    validate(updateUserSchema),
    updateUser
);

router.delete("/:id", validate(idParamSchema), deleteUser);

export default router;