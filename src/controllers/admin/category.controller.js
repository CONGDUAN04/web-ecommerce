import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getCategoriesServices,
  getCategoryByIdServices,
  createCategoryServices,
  updateCategoryServices,
  deleteCategoryServices,
} from "../../services/admin/category.services.js";

export const getCategories = asyncHandler(async (req, res) => {
  const result = await getCategoriesServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await getCategoryByIdServices(req.validated.params.id);
  return ApiResponse.success(res, category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await createCategoryServices(req.validated.body);
  return ApiResponse.created(res, category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await updateCategoryServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await deleteCategoryServices(req.validated.params.id);
  return ApiResponse.deleted(res);
});
