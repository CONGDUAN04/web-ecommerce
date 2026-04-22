import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../common/base.controller.js";

import {
  getRolesServices,
  getRoleByIdServices,
  createRoleServices,
  updateRoleServices,
  deleteRoleServices,
} from "../../services/admin/role.services.js";

export const getRoles = asyncHandler(handleGetAll(getRolesServices));
export const getRoleById = asyncHandler(handleGetById(getRoleByIdServices));
export const createRole = asyncHandler(handleCreate(createRoleServices));
export const updateRole = asyncHandler(handleUpdate(updateRoleServices));
export const deleteRole = asyncHandler(handleDelete(deleteRoleServices));
