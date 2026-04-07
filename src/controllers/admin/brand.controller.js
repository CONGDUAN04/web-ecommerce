import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getBrandsServices,
  getBrandByIdServices,
  createBrandServices,
  updateBrandServices,
  deleteBrandServices,
} from "../../services/admin/brand.services.js";

export const getBrands = asyncHandler(async (req, res) => {
  const result = await getBrandsServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getBrandById = asyncHandler(async (req, res) => {
  const brand = await getBrandByIdServices(req.validated.params.id);
  return ApiResponse.success(res, brand);
});

export const createBrand = asyncHandler(async (req, res) => {
  const brand = await createBrandServices({
    ...req.validated.body,
    logo: req.file?.filename ?? null,
  });
  return ApiResponse.created(res, brand);
});

export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await updateBrandServices(
    req.validated.params.id,
    req.validated.body,
    req.file?.filename,
  );
  return ApiResponse.updated(res, brand);
});

export const deleteBrand = asyncHandler(async (req, res) => {
  await deleteBrandServices(req.validated.params.id);
  return ApiResponse.deleted(res);
});
