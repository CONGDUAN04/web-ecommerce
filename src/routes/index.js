import { Router } from "express";
import { checkValidJWT, isAdmin } from "../middleware/jwt.js";
import userRoutes from "./api.user.js";
import productRoutes from "./api.product.js";
import categoryRoutes from "./api.category.js";
import brandRoutes from "./api.brand.js";
import dashboardRoutes from "./api.dashboard.js";
import roleRoutes from "./api.role.js";
import productGroupRoutes from "./api.productGroup.js";
import variantRoutes from "../routes/admin/api.variant.js";
import voucherRoutes from "../routes/admin/api.voucher.js";
import inventoryRoutes from "./api.inventory.js";

const router = Router();

router.use(checkValidJWT, isAdmin);
router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/product-groups", productGroupRoutes);
router.use("/roles", roleRoutes);
router.use("/variants", variantRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/inventory", inventoryRoutes);

export default router;
