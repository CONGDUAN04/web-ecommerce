import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getOrdersServices,
  getOrderByIdServices,
  confirmOrderServices,
  shipOrderServices,
  completeOrderServices,
  cancelOrderServices,
  approveReturnServices,
  rejectReturnServices,
  completeReturnServices,
} from "../../services/admin/order.services.js";

export const getOrders = asyncHandler(async (req, res) => {
  const result = await getOrdersServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderByIdServices(req.validated.params.id);
  return ApiResponse.success(res, order);
});

export const confirmOrder = asyncHandler(async (req, res) => {
  const order = await confirmOrderServices(req.validated.params.id);
  return ApiResponse.updated(res, order);
});

export const shipOrder = asyncHandler(async (req, res) => {
  const order = await shipOrderServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, order);
});

export const completeOrder = asyncHandler(async (req, res) => {
  const order = await completeOrderServices(req.validated.params.id);
  return ApiResponse.updated(res, order);
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await cancelOrderServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, order);
});

export const approveReturn = asyncHandler(async (req, res) => {
  const order = await approveReturnServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, order);
});

export const rejectReturn = asyncHandler(async (req, res) => {
  const order = await rejectReturnServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, order);
});

export const completeReturn = asyncHandler(async (req, res) => {
  const order = await completeReturnServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, order);
});
