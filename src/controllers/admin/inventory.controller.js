import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getInventoryLogsServices,
  getInventoryLogByIdServices,
  getInventorySummaryServices,
  createInventoryLogServices,
} from "../../services/admin/inventory.services.js";

export const getInventoryLogs = asyncHandler(async (req, res) => {
  const result = await getInventoryLogsServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getInventorySummary = asyncHandler(async (req, res) => {
  const result = await getInventorySummaryServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getInventoryLogById = asyncHandler(async (req, res) => {
  const log = await getInventoryLogByIdServices(req.validated.params.id);
  return ApiResponse.success(res, log);
});

export const createInventoryLog = asyncHandler(async (req, res) => {
  const log = await createInventoryLogServices(req.validated.body);
  return ApiResponse.created(res, log);
});
