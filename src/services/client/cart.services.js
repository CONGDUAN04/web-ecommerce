import prisma from "../../config/client.js";
import { cartItemSelect } from "../../constants/cart.select.js";
import { formatCart } from "../../utils/cart.js";

// ========================
// GET CART
// ========================

export const getCartService = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: {
      id: true,
      cartItems: {
        select: cartItemSelect,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cart) return { items: [], subtotal: 0, totalItems: 0 };

  return formatCart(cart);
};

// ========================
// ADD TO CART
// ========================

export const addToCartService = async (userId, { variantId, quantity = 1 }) => {
  return prisma.$transaction(async (tx) => {
    const variant = await tx.variant.findUnique({
      where: { id: variantId },
      select: {
        id: true,
        price: true,
        quantity: true,
        isActive: true,
        product: { select: { isActive: true } },
      },
    });

    if (!variant || !variant.isActive || !variant.product.isActive) {
      throw new Error("Sản phẩm không tồn tại hoặc đã ngừng kinh doanh");
    }

    if (variant.quantity < quantity) {
      throw new Error(`Sản phẩm chỉ còn ${variant.quantity} trong kho`);
    }

    const cart = await tx.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;

      if (newQty > variant.quantity) {
        throw new Error(`Sản phẩm chỉ còn ${variant.quantity} trong kho`);
      }

      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty, price: variant.price },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
          price: variant.price,
        },
      });
    }

    return getCartService(userId);
  });
};

// ========================
// UPDATE CART ITEM
// ========================

export const updateCartItemService = async (userId, itemId, quantity) => {
  return prisma.$transaction(async (tx) => {
    const item = await tx.cartItem.findFirst({
      where: {
        id: parseInt(itemId),
        cart: { userId },
      },
      select: {
        id: true,
        variant: {
          select: { quantity: true, price: true },
        },
      },
    });

    if (!item) throw new Error("Sản phẩm không có trong giỏ hàng");

    if (quantity > item.variant.quantity) {
      throw new Error(`Sản phẩm chỉ còn ${item.variant.quantity} trong kho`);
    }

    await tx.cartItem.update({
      where: { id: item.id },
      data: {
        quantity,
        price: item.variant.price,
      },
    });

    return getCartService(userId);
  });
};

// ========================
// REMOVE CART ITEM
// ========================

export const removeCartItemService = async (userId, itemId) => {
  await prisma.cartItem.deleteMany({
    where: {
      id: parseInt(itemId),
      cart: { userId },
    },
  });

  return getCartService(userId);
};

// ========================
// CLEAR CART
// ========================

export const clearCartService = async (userId) => {
  await prisma.cartItem.deleteMany({
    where: {
      cart: { userId },
    },
  });

  return { items: [], subtotal: 0, totalItems: 0 };
};
