import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getVariantsServices,
  getVariantByIdServices,
  getVariantsByProductIdServices,
  createVariantServices,
  updateVariantServices,
  deleteVariantServices,
} from "../../services/admin/variant.services.js";

export const getVariants = asyncHandler(async (req, res) => {
  const result = await getVariantsServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getVariantById = asyncHandler(async (req, res) => {
  const variant = await getVariantByIdServices(req.validated.params.id);
  return ApiResponse.success(res, variant);
});

export const getVariantsByProductId = asyncHandler(async (req, res) => {
  const data = await getVariantsByProductIdServices(req.params.productId);
  return ApiResponse.success(res, data);
});

export const createVariant = asyncHandler(async (req, res) => {
  const variant = await createVariantServices(req.validated.body);
  return ApiResponse.created(res, variant);
});

export const updateVariant = asyncHandler(async (req, res) => {
  const variant = await updateVariantServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, variant);
});

export const deleteVariant = asyncHandler(async (req, res) => {
  await deleteVariantServices(req.validated.params.id);
  return ApiResponse.deleted(res);
});
