// src/routes/product.routes.js
import { Router } from "express";
import { postCreateUser, getAllUsers, putUpdateUser, deleteUserById, getUserById } from "../controllers/admin/user.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";
const router = Router();

router.post("/", uploadSingleFile("avatar", "images/avatar"), postCreateUser);
router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.put("/:id", uploadSingleFile("avatar", "images/avatar"), putUpdateUser);
router.delete("/:id", deleteUserById)
export default router;
