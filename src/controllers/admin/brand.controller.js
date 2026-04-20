import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../common/base.controller.js";

import {
  getBrandsServices,
  getBrandByIdServices,
  createBrandServices,
  updateBrandServices,
  deleteBrandServices,
} from "../../services/admin/brand.services.js";

export const getBrands = asyncHandler(handleGetAll(getBrandsServices));
export const getBrandById = asyncHandler(handleGetById(getBrandByIdServices));
export const createBrand = asyncHandler(handleCreate(createBrandServices));
export const updateBrand = asyncHandler(handleUpdate(updateBrandServices));
export const deleteBrand = asyncHandler(handleDelete(deleteBrandServices));
