import { Router } from "express";
import userRoutes from "./api.user.js";
import productRoutes from "./api.product.js";
import categoryRoutes from "./api.category.js"
import brandRoutes from "./api.brand.js"
import targetRoutes from "./api.target.js";
import colorRoutes from "./api.color.js"
import storageRoutes from "./api.storage.js"
import dashboardRoutes from "./api.dashboard.js"
import roleRoutes from "./api.role.js"

const router = Router();

router.use("/dashboard", dashboardRoutes)
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes)
router.use("/brands", brandRoutes)
router.use("/targets", targetRoutes)
router.use("/colors", colorRoutes)
router.use("/storages", storageRoutes)
router.use("/roles", roleRoutes)
export default router;
