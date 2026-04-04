import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getUsersServices,
  getUserByIdServices,
  createUserServices,
  updateUserServices,
  deleteUserServices,
} from "../../services/admin/user.services.js";

export const getUsers = asyncHandler(async (req, res) => {
  const result = await getUsersServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdServices(req.validated.params.id);
  return ApiResponse.success(res, user);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserServices(req.validated.body, req.file?.filename);
  return ApiResponse.created(res, user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserServices(
    req.validated.params.id,
    req.validated.body,
    req.file?.filename,
  );
  return ApiResponse.updated(res, user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await deleteUserServices(req.validated.params.id);
  return ApiResponse.deleted(res);
});
