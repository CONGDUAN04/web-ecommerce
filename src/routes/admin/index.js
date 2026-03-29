import { Router } from "express";
import userRoutes from "./api.user.js";
import productRoutes from "./api.product.js";
import categoryRoutes from "./api.category.js";
import brandRoutes from "./api.brand.js";
import dashboardRoutes from "./api.dashboard.js";
import roleRoutes from "./api.role.js";
import productGroupRoutes from "./api.productGroup.js";
import variantRoutes from "./api.variant.js";
import voucherRoutes from "./api.voucher.js";
import inventoryRoutes from "./api.inventory.js";
import orderRoutes from "./api.order.js";
import paymentRouter from "./api.payment.js";
const router = Router();

router.use("/payments", paymentRouter);
router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/product-groups", productGroupRoutes);
router.use("/roles", roleRoutes);
router.use("/variants", variantRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/inventories", inventoryRoutes);
router.use("/orders", orderRoutes);

export default router;
