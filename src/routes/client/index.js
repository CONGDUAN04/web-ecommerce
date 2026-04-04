import { Router } from "express";
import productRoutes from "./api.product.js";
import cartRoutes from "./api.cart.js";
import orderRoutes from "./api.order.js";
import userRoutes from "./api.user.js";
import wishlistRoutes from "./api.wishlist.js";
import notificationRoutes from "./api.notification.js";
const router = Router();

router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/me", userRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/notifications", notificationRoutes);
export default router;
