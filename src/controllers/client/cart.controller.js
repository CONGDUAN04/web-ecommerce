import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from "../../services/client/cart.services.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService(req.user.id);
  return ApiResponse.success(res, cart);
});

export const addToCart = asyncHandler(async (req, res) => {
  const cart = await addToCartService(req.user.id, req.validated.body);
  return ApiResponse.success(res, cart);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await updateCartItemService(
    req.user.id,
    req.validated.params.itemId,
    req.validated.body.quantity,
  );
  return ApiResponse.updated(res, cart);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await removeCartItemService(
    req.user.id,
    req.validated.params.itemId,
  );
  return ApiResponse.success(res, cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  await clearCartService(req.user.id);
  return ApiResponse.deleted(res, "Xoá giỏ hàng thành công");
});
