import express from "express";
import userRoutes from "./api.user.js";
import productRoutes from "./api.product.js";

const router = express.Router();


router.use("/users", userRoutes);
router.use("/products", productRoutes);

export default router;
