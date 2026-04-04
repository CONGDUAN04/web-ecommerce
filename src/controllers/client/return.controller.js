import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  createReturnRequestService,
  getReturnRequestService,
} from "../../services/client/return.services.js";

export const createReturnRequest = asyncHandler(async (req, res) => {
  const result = await createReturnRequestService(
    req.user.id,
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.created(res, result);
});

export const getReturnRequest = asyncHandler(async (req, res) => {
  const result = await getReturnRequestService(
    req.user.id,
    req.validated.params.id,
  );
  return ApiResponse.success(res, result);
});
