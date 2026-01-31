import express from "express";
import { validate } from "../middleware/validate.middleware.js";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/admin/user.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";
import { idParamSchema } from "../validations/common/params.js";
import { paginationSchema } from "../validations/common/query.js";
import { uploadErrorHandler } from "../middleware/uploadErrorHandler.js";
import { createUserSchema, updateUserSchema } from "../validations/user/user.schema.js";

const router = express.Router();

router.post(
    "/",
    uploadSingleFile("avatar", "images/avatar"),
    uploadErrorHandler,
    validate(createUserSchema),
    createUser
);

router.get("/", validate(paginationSchema), getUsers);

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