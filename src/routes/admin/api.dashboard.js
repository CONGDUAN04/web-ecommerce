import { Router } from "express";

import {
  getDashboardOverview,
  getRevenueSummary,
  getOrderStatus,
  getTopProducts,
  getLowStock,
  getRecentOrders,
} from "../../controllers/admin/dashboard.controller.js";

const router = Router();

// GET /api/admin/dashboard
router.get("/", getDashboardOverview);

// GET /api/admin/dashboard/revenue
router.get("/revenue", getRevenueSummary);

// GET /api/admin/dashboard/orders/status
router.get("/orders/status", getOrderStatus);

// GET /api/admin/dashboard/products/top
router.get("/products/top", getTopProducts);

// GET /api/admin/dashboard/products/low-stock
router.get("/products/low-stock", getLowStock);

// GET /api/admin/dashboard/orders/recent
router.get("/orders/recent", getRecentOrders);

export default router;
