import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdate,
  handleDelete,
} from "../common/base.controller.js";

import {
  getUsersServices,
  getUserByIdServices,
  createUserServices,
  updateUserServices,
  deleteUserServices,
  updateUserStatusServices,
} from "../../services/admin/user.services.js";
import { ApiResponse } from "../../utils/response.js";

export const getUsers = asyncHandler(handleGetAll(getUsersServices));

export const getUserById = asyncHandler(handleGetById(getUserByIdServices));

export const createUser = asyncHandler(async (req, res) => {
  const data = await createUserServices(req.validated.body, req.user);
  return ApiResponse.created(res, data);
});

export const updateUser = asyncHandler(async (req, res) => {
  const data = await updateUserServices(
    req.validated.params.id,
    req.validated.body,
    req.user,
  );
  return ApiResponse.updated(res, data);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const data = await deleteUserServices(req.params.id, req.user);
  return ApiResponse.deleted(res);
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const data = await updateUserStatusServices(
    req.validated.params.id,
    req.validated.body,
    req.user,
  );

  return ApiResponse.updated(res, data);
});
