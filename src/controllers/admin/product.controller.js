import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";

import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../common/base.controller.js";

import {
  getProductsServices,
  getProductByIdServices,
  createProductServices,
  updateProductServices,
  deleteProductServices,
  getProductBySlugServices,
  updateProductStatusService,
} from "../../services/admin/product.services.js";

export const getProducts = asyncHandler(handleGetAll(getProductsServices));

export const getProductById = asyncHandler(
  handleGetById(getProductByIdServices),
);

export const createProduct = asyncHandler(handleCreate(createProductServices));

export const updateProduct = asyncHandler(handleUpdate(updateProductServices));

export const deleteProduct = asyncHandler(handleDelete(deleteProductServices));

export const getProductBySlug = asyncHandler(async (req, res) => {
  const data = await getProductBySlugServices(req.params.slug);
  return ApiResponse.success(res, data);
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const data = await updateProductStatusService(
    req.validated.params.id,
    req.validated.body,
  );

  return ApiResponse.updated(res, data);
});
