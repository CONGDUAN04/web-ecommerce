import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getProductGroupsServices,
  getProductGroupByIdServices,
  createProductGroupServices,
  updateProductGroupServices,
  deleteProductGroupServices,
} from "../../services/admin/productGroup.services.js";

export const getProductGroups = asyncHandler(async (req, res) => {
  const result = await getProductGroupsServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getProductGroupById = asyncHandler(async (req, res) => {
  const data = await getProductGroupByIdServices(req.validated.params.id);
  return ApiResponse.success(res, data);
});

export const createProductGroup = asyncHandler(async (req, res) => {
  const data = await createProductGroupServices(
    req.validated.body,
    req.file?.filename,
  );
  return ApiResponse.created(res, data);
});

export const updateProductGroup = asyncHandler(async (req, res) => {
  const data = await updateProductGroupServices(
    req.validated.params.id,
    req.validated.body,
    req.file?.filename,
  );
  return ApiResponse.updated(res, data);
});

export const deleteProductGroup = asyncHandler(async (req, res) => {
  await deleteProductGroupServices(req.validated.params.id);
  return ApiResponse.deleted(res);
});
