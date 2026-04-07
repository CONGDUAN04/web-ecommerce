import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getAddressesService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
} from "../../services/client/address.services.js";

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await getAddressesService(req.user.id);
  return ApiResponse.success(res, addresses);
});

export const createAddress = asyncHandler(async (req, res) => {
  const address = await createAddressService(req.user.id, req.validated.body);
  return ApiResponse.created(res, address);
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await updateAddressService(
    req.user.id,
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, address);
});

export const deleteAddress = asyncHandler(async (req, res) => {
  await deleteAddressService(req.user.id, req.validated.params.id);
  return ApiResponse.deleted(res);
});
