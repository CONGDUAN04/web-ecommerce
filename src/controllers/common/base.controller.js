import { ApiResponse } from "../../utils/response.js";

export const handleGetAll = (service) => async (req, res) => {
  const result = await service(req.validated.query);
  return ApiResponse.success(res, result.items, {
    meta: result.pagination,
  });
};

export const handleGetById = (service) => async (req, res) => {
  const data = await service(req.validated.params.id);
  return ApiResponse.success(res, data);
};

export const handleCreate = (service) => async (req, res) => {
  const data = await service(req.validated.body);
  return ApiResponse.created(res, data);
};

export const handleUpdate = (service) => async (req, res) => {
  const data = await service(req.validated.params.id, req.validated.body);
  return ApiResponse.updated(res, data);
};

export const handleDelete = (service) => async (req, res) => {
  await service(req.validated.params.id);
  return ApiResponse.deleted(res);
};
