import {
  getCategoriesServices,
  getCategoryByIdServices,
  createCategoryServices,
  updateCategoryServices,
  deleteCategoryServices,
} from "../../services/admin/category.services.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../common/base.controller.js";
export const getCategories = asyncHandler(handleGetAll(getCategoriesServices));
export const getCategoryById = asyncHandler(
  handleGetById(getCategoryByIdServices),
);
export const createCategory = asyncHandler(
  handleCreate(createCategoryServices),
);
export const updateCategory = asyncHandler(
  handleUpdate(updateCategoryServices),
);

export const deleteCategory = asyncHandler(
  handleDelete(deleteCategoryServices),
);
