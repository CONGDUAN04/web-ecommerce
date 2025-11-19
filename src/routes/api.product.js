import { Router } from "express";
import { postCreateProduct, getAllProducts, putUpdateProduct, deleteProduct, getProductById } from "../controllers/admin/product.controller.js";
import fileUploadMiddleware from "../middleware/multer.js";
import { cleanupFile } from "../middleware/cleanupFile.js";
const router = Router();

router.post("/", fileUploadMiddleware("image", "images/product"), cleanupFile, postCreateProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", fileUploadMiddleware("image", "images/product"), cleanupFile, putUpdateProduct);
router.delete("/:id", deleteProduct);
export default router;
