import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from "../../services/client/cart.services.js";

const handleError = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({ ErrorCode: 1, message: error.message });
};

// GET /api/v1/cart
export const getCart = async (req, res) => {
  try {
    const cart = await getCartService(req.user.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return handleError(res, error, 500);
  }
};

// POST /api/v1/cart/items
export const addToCart = async (req, res) => {
  try {
    const cart = await addToCartService(req.user.id, req.validated.body);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Thêm vào giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PATCH /api/v1/cart/items/:itemId
export const updateCartItem = async (req, res) => {
  try {
    const cart = await updateCartItemService(
      req.user.id,
      req.validated.params.itemId,
      req.validated.body.quantity,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Cập nhật giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/v1/cart/items/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const cart = await removeCartItemService(
      req.user.id,
      req.validated.params.itemId,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Xoá sản phẩm khỏi giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/v1/cart
export const clearCart = async (req, res) => {
  try {
    await clearCartService(req.user.id);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Xoá giỏ hàng thành công",
    });
  } catch (error) {
    return handleError(res, error, 500);
  }
};
