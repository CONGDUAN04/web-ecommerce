import { asyncHandler } from "../../middleware/asyncHandler.js";

import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../common/base.controller.js";

import {
  getProductColorsServices,
  getProductColorByIdServices,
  createProductColorServices,
  updateProductColorServices,
  deleteProductColorServices,
} from "../../services/admin/productColor.services.js";

export const getProductColors = asyncHandler(
  handleGetAll(getProductColorsServices),
);

export const getProductColorById = asyncHandler(
  handleGetById(getProductColorByIdServices),
);

export const createProductColor = asyncHandler(
  handleCreate(createProductColorServices),
);

export const updateProductColor = asyncHandler(
  handleUpdate(updateProductColorServices),
);

export const deleteProductColor = asyncHandler(
  handleDelete(deleteProductColorServices),
);
