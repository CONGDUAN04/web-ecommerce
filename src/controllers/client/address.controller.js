import {
  getAddressesService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
} from "../../services/client/address.services.js";

const handleError = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({ ErrorCode: 1, message: error.message });
};

// GET /api/v1/me/addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await getAddressesService(req.user.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy danh sách địa chỉ thành công",
      data: addresses,
    });
  } catch (error) {
    return handleError(res, error, 500);
  }
};

// POST /api/v1/me/addresses
export const createAddress = async (req, res) => {
  try {
    const address = await createAddressService(req.user.id, req.validated.body);
    return res.status(201).json({
      ErrorCode: 0,
      message: "Thêm địa chỉ thành công",
      data: address,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PATCH /api/v1/me/addresses/:id
export const updateAddress = async (req, res) => {
  try {
    const address = await updateAddressService(
      req.user.id,
      req.validated.params.id,
      req.validated.body,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Cập nhật địa chỉ thành công",
      data: address,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/v1/me/addresses/:id
export const deleteAddress = async (req, res) => {
  try {
    await deleteAddressService(req.user.id, req.validated.params.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Xoá địa chỉ thành công",
    });
  } catch (error) {
    return handleError(res, error);
  }
};
