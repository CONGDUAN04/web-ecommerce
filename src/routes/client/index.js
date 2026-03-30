import { Router } from "express";
import productRoutes from "./api.product.js";
import cartRoutes from "./api.cart.js";
const router = Router();

router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
export default router;
