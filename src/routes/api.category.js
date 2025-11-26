import { Router } from "express";
import { getCategory, getCategoryById, updateCategory, createCategory, deleteCategory } from "../controllers/admin/category.controller.js";
import { uploadSingleFile } from "../middleware/multer.js";

const router = Router();
router.get("/", getCategory);
router.get("/:id", getCategoryById);
router.post("/", uploadSingleFile('image', 'images/category'), createCategory)
router.put("/:id", uploadSingleFile('image', 'images/category'), updateCategory);
router.delete("/:id", deleteCategory);
export default router;
