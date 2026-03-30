import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../controllers/client/cart.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../../validations/client/cart.validation.js";

const router = Router();

// GET    /api/v1/cart
// DELETE /api/v1/cart
router.get("/", getCart);
router.delete("/", clearCart);

// POST   /api/v1/cart/items
// PATCH  /api/v1/cart/items/:itemId
// DELETE /api/v1/cart/items/:itemId
router.post("/items", validate(addToCartSchema), addToCart);
router.patch("/items/:itemId", validate(updateCartItemSchema), updateCartItem);
router.delete("/items/:itemId", validate(removeCartItemSchema), removeCartItem);

export default router;
