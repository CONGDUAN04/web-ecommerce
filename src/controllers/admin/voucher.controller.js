import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getVoucherServices,
  getVoucherByIdServices,
  createVoucherServices,
  updateVoucherServices,
  deleteVoucherServices,
  getVoucherUsageServices,
} from "../../services/admin/voucher.services.js";

export const getVouchers = asyncHandler(async (req, res) => {
  const result = await getVoucherServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.meta });
});

export const getVoucherById = asyncHandler(async (req, res) => {
  const voucher = await getVoucherByIdServices(req.validated.params.id);
  return ApiResponse.success(res, voucher);
});

export const createVoucher = asyncHandler(async (req, res) => {
  const voucher = await createVoucherServices(req.validated.body);
  return ApiResponse.created(res, voucher);
});

export const updateVoucher = asyncHandler(async (req, res) => {
  const voucher = await updateVoucherServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, voucher);
});

export const deleteVoucher = asyncHandler(async (req, res) => {
  await deleteVoucherServices(req.validated.params.id);
  return ApiResponse.deleted(res);
});

export const getVoucherUsages = asyncHandler(async (req, res) => {
  const result = await getVoucherUsageServices(
    req.validated.params.id,
    req.validated.query,
  );
  return ApiResponse.success(res, result.items, {
    meta: result.meta,
    data: { voucher: result.voucher },
  });
});
