import { asyncHandler } from "../../middleware/asyncHandler.js";

import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../common/base.controller.js";

import {
  getColorsServices,
  getColorByIdServices,
  createColorServices,
  updateColorServices,
  deleteColorServices,
} from "../../services/admin/color.services.js";

export const getColors = asyncHandler(handleGetAll(getColorsServices));

export const getColorById = asyncHandler(handleGetById(getColorByIdServices));

export const createColor = asyncHandler(handleCreate(createColorServices));

export const updateColor = asyncHandler(handleUpdate(updateColorServices));

export const deleteColor = asyncHandler(handleDelete(deleteColorServices));
