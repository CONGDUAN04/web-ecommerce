import { Router } from "express";
import { postCreateProduct, getAllProducts, putUpdateProduct, deleteProduct } from "../controllers/product.controller.js";
const router = Router();

router.post("/", postCreateProduct);
router.get("/", getAllProducts);
router.put("/", putUpdateProduct);
router.delete("/", deleteProduct);
export default router;
