import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getPaymentsServices,
  getPaymentByIdServices,
  confirmBankingServices,
} from "../../services/admin/payment.services.js";

export const getPayments = asyncHandler(async (req, res) => {
  const result = await getPaymentsServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await getPaymentByIdServices(req.validated.params.id);
  return ApiResponse.success(res, payment);
});

export const confirmBanking = asyncHandler(async (req, res) => {
  const payment = await confirmBankingServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, payment);
});
