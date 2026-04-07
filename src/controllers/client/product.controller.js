import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getProductsService,
  getProductBySlugService,
  searchProductsService,
  getRelatedProductsService,
  getProductGroupsService,
  getProductGroupBySlugService,
} from "../../services/client/product.services.js";

export const getProducts = asyncHandler(async (req, res) => {
  const result = await getProductsService(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const result = await searchProductsService(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await getProductBySlugService(req.validated.params.slug);
  return ApiResponse.success(res, product);
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const products = await getRelatedProductsService(req.validated.params.slug);
  return ApiResponse.success(res, products);
});

export const getProductGroups = asyncHandler(async (req, res) => {
  const result = await getProductGroupsService(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getProductGroupBySlug = asyncHandler(async (req, res) => {
  const group = await getProductGroupBySlugService(
    req.validated.params.slug,
    req.validated.query,
  );
  return ApiResponse.success(res, group);
});
