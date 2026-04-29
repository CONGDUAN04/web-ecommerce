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
  getProductGroupsServices,
  getProductGroupByIdServices,
  createProductGroupServices,
  updateProductGroupServices,
  deleteProductGroupServices,
  updateProductGroupStatusService,
} from "../../services/admin/productGroup.services.js";

export const getProductGroups = asyncHandler(
  handleGetAll(getProductGroupsServices),
);

export const getProductGroupById = asyncHandler(
  handleGetById(getProductGroupByIdServices),
);

export const createProductGroup = asyncHandler(
  handleCreate(createProductGroupServices),
);

export const updateProductGroup = asyncHandler(
  handleUpdate(updateProductGroupServices),
);

export const deleteProductGroup = asyncHandler(
  handleDelete(deleteProductGroupServices),
);

export const updateProductGroupStatus = asyncHandler(async (req, res) => {
  const data = await updateProductGroupStatusService(
    req.validated.params.id,
    req.validated.body,
    req.user,
  );

  return ApiResponse.updated(res, data);
});
