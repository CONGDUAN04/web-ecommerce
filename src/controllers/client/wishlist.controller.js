import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {
  getWishlistService,
  addToWishlistService,
  removeFromWishlistService,
  checkWishlistService,
} from "../../services/client/wishlist.services.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getWishlistService(req.user.id);
  return ApiResponse.success(res, wishlist);
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await addToWishlistService(req.user.id, req.validated.body);
  return ApiResponse.add(res, wishlist);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await removeFromWishlistService(
    req.user.id,
    req.validated.params.productId,
  );
  return ApiResponse.deleted(res, "Xóa sản phẩm khỏi wishlist thành công");
});

export const checkWishlist = asyncHandler(async (req, res) => {
  const inWishlist = await checkWishlistService(
    req.user.id,
    req.validated.params.id,
  );
  return ApiResponse.success(
    res,
    { inWishlist },
    { message: "Kiểm tra wishlist thành công" },
  );
});
