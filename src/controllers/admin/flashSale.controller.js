import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getFlashSalesServices,
  getFlashSaleByIdServices,
  createFlashSaleServices,
  updateFlashSaleServices,
  deleteFlashSaleServices,
  addFlashSaleItemsServices,
  updateFlashSaleItemServices,
  deleteFlashSaleItemServices,
} from "../../services/admin/flashSale.services.js";

export const getFlashSales = asyncHandler(async (req, res) => {
  const result = await getFlashSalesServices(req.validated.query);
  return ApiResponse.success(res, result.items, { meta: result.pagination });
});

export const getFlashSaleById = asyncHandler(async (req, res) => {
  const flashSale = await getFlashSaleByIdServices(req.validated.params.id);
  return ApiResponse.success(res, flashSale);
});

export const createFlashSale = asyncHandler(async (req, res) => {
  const flashSale = await createFlashSaleServices(req.validated.body);
  return ApiResponse.created(res, flashSale);
});

export const updateFlashSale = asyncHandler(async (req, res) => {
  const flashSale = await updateFlashSaleServices(
    req.validated.params.id,
    req.validated.body,
  );
  return ApiResponse.updated(res, flashSale);
});

export const deleteFlashSale = asyncHandler(async (req, res) => {
  await deleteFlashSaleServices(req.validated.params.id);
  return ApiResponse.deleted(res);
});

// ─── Items ────────────────────────────────────────────────────────────────────

export const addFlashSaleItems = asyncHandler(async (req, res) => {
  const flashSale = await addFlashSaleItemsServices(
    req.validated.params.id,
    req.validated.body.items,
  );
  return ApiResponse.add(
    res,
    flashSale,
    "Thêm sản phẩm vào flash sale thành công",
  );
});

export const updateFlashSaleItem = asyncHandler(async (req, res) => {
  const item = await updateFlashSaleItemServices(
    req.validated.params.id,
    req.validated.params.itemId,
    req.validated.body,
  );
  return ApiResponse.updated(res, item);
});

export const deleteFlashSaleItem = asyncHandler(async (req, res) => {
  await deleteFlashSaleItemServices(
    req.validated.params.id,
    req.validated.params.itemId,
  );
  return ApiResponse.deleted(res);
});
