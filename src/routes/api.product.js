import { Router } from "express";
import { putUpdateProduct, deleteProduct, getProductByIdController, getAllProductsController, postCreateProductController } from "../controllers/admin/product.controller.js";
import { uploadMultipleFields } from "../middleware/multer.js";
import { cleanupFile } from "../middleware/cleanupFile.js";
const router = Router();

router.post("/", uploadMultipleFields(), cleanupFile, postCreateProductController);
router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);
router.put("/:id", uploadMultipleFields(), cleanupFile, putUpdateProduct);
router.delete("/:id", deleteProduct);
export default router;
