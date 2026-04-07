import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getProductsServices,
  getProductByIdServices,
  getProductBySlugServices,
  createProductServices,
  updateProductServices,
  deleteProductServices,
} from "../../services/admin/product.services.js";

export const getProducts = asyncHandler(async (req, res) => {
  const result = await getProductsServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getProductById = asyncHandler(async (req, res) => {
  const data = await getProductByIdServices(req.validated.params.id);
  return ApiResponse.success(res, data);
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const data = await getProductBySlugServices(req.params.slug);
  return ApiResponse.success(res, data);
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = await createProductServices(
    req.validated.body,
    req.file?.filename,
  );
  return ApiResponse.created(res, data);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const data = await updateProductServices(
    req.validated.params.id,
    req.validated.body,
    req.file?.filename,
  );
  return ApiResponse.updated(res, data);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductServices(req.validated.params.id);
  return ApiResponse.deleted(res);
});
