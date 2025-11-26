import express from "express";
import userRoutes from "./api.user.js";
import productRoutes from "./api.product.js";
import categoryRoutes from "./api.category.js"
import brandRoutes from "./api.brand.js"
import targetRoutes from "./api.target.js"
import dashboardRoutes from "./api.dashboard.js"
const router = express.Router();

router.use("/dashboard", dashboardRoutes)
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes)
router.use("/brands", brandRoutes)
router.use("/targets", targetRoutes)
export default router;
