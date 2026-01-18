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
import { cleanupFile } from "../middleware/cleanupFile.js";
import { idParamSchema } from "../validations/common/params.js";
import { paginationSchema } from "../validations/common/query.js";
import { updateUserSchema } from "../validations/user/update.user.js";
import { createUserSchema } from "../validations/user/create.user.js";

const router = express.Router();

router.post(
    "/",
    uploadSingleFile("avatar", "images/avatar"),
    validate(createUserSchema),
    cleanupFile,
    createUser
);

router.get("/", validate(paginationSchema), getUsers);

router.get("/roles", getRoles);

router.get("/:id", validate(idParamSchema), getUserById);

router.put(
    "/:id",
    uploadSingleFile("avatar", "images/avatar"),
    validate(updateUserSchema),
    cleanupFile,
    updateUser
);

router.delete("/:id", validate(idParamSchema), deleteUser);

export default router;