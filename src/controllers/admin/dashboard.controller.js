import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getDashboardOverviewServices,
  getRevenueSummaryServices,
  getOrderStatusServices,
  getTopProductsServices,
  getLowStockServices,
  getRecentOrdersServices,
} from "../../services/admin/dashboard.services.js";

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const data = await getDashboardOverviewServices();
  return ApiResponse.success(res, data);
});

export const getRevenueSummary = asyncHandler(async (req, res) => {
  const data = await getRevenueSummaryServices();
  return ApiResponse.success(res, data);
});

export const getOrderStatus = asyncHandler(async (req, res) => {
  const data = await getOrderStatusServices();
  return ApiResponse.success(res, data);
});

export const getTopProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
  const data = await getTopProductsServices(limit);
  return ApiResponse.success(res, data);
});

export const getLowStock = asyncHandler(async (req, res) => {
  const threshold = Math.min(
    Math.max(parseInt(req.query.threshold) || 5, 0),
    100,
  );
  const data = await getLowStockServices(threshold);
  return ApiResponse.success(res, data);
});

export const getRecentOrders = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 20);
  const data = await getRecentOrdersServices(limit);
  return ApiResponse.success(res, data);
});
