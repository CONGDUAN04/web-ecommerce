import { Router } from "express";
import productRoutes from "./api.product.js";
import cartRoutes from "./api.cart.js";
import orderRoutes from "./api.order.js";
const router = Router();

router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
export default router;
