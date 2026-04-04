import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  cancelOrderService,
} from "../../services/client/order.services.js";

export const createOrder = asyncHandler(async (req, res) => {
  const order = await createOrderService(req.user.id, req.validated.body);
  return ApiResponse.created(res, order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const result = await getOrdersService(req.user.id, req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderByIdService(req.user.id, req.validated.params.id);
  return ApiResponse.success(res, order);
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await cancelOrderService(
    req.user.id,
    req.validated.params.id,
    req.validated.body.cancelReason,
  );
  return ApiResponse.updated(res, order);
});
