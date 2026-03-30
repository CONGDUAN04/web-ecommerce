import { Router } from "express";
import productRoutes from "./api.product.js";
const router = Router();

router.use("/products", productRoutes);
export default router;
