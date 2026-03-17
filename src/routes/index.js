import { Router } from "express";
import { checkValidJWT, isAdmin } from "../middleware/jwt.js";
import userRoutes from "./api.user.js";
import productRoutes from "./api.product.js";
import categoryRoutes from "./api.category.js";
import brandRoutes from "./api.brand.js";
import colorRoutes from "./api.color.js";
import dashboardRoutes from "./api.dashboard.js";
import roleRoutes from "./api.role.js";
import productGroupRoutes from "./api.productGroup.js";
import inventoryRoutes from "./api.inventory.js";
const router = Router();

router.use(checkValidJWT, isAdmin);
router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/colors", colorRoutes);
router.use("/product-groups", productGroupRoutes);
router.use("/roles", roleRoutes);
router.use("/inventory", inventoryRoutes);

export default router;
