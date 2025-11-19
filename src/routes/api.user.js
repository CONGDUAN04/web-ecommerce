// src/routes/product.routes.js
import { Router } from "express";
import { postCreateUser, getAllUsers, putUpdateUser, deleteUserById, getUserById } from "../controllers/admin/user.controller.js";
import fileUploadMiddleware from "../middleware/multer.js";
import { cleanupFile } from "../middleware/cleanupFile.js";
const router = Router();

router.post("/", fileUploadMiddleware("avatar", "images/user"), cleanupFile, postCreateUser);
router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.put("/:id", fileUploadMiddleware("avatar", "images/user"), cleanupFile, putUpdateUser);
router.delete("/:id", deleteUserById)
export default router;
