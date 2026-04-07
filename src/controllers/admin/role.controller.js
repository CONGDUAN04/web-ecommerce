import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  createRoleServices,
  getRolesServices,
  getRoleByIdServices,
  updateRoleServices,
  deleteRoleServices,
} from "../../services/admin/role.services.js";

export const getRoles = asyncHandler(async (req, res) => {
  const result = await getRolesServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getRoleById = asyncHandler(async (req, res) => {
  const role = await getRoleByIdServices(req.validated.params.id);
  return ApiResponse.success(res, role);
});

export const createRole = asyncHandler(async (req, res) => {
  const role = await createRoleServices(req.validated.body);
  return ApiResponse.created(res, role);
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await updateRoleServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, role);
});

export const deleteRole = asyncHandler(async (req, res) => {
  await deleteRoleServices(req.validated.params.id);
  return ApiResponse.deleted(res);
});
