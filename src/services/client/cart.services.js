import prisma from "../../config/client.js";

// ========================
// HELPERS
// ========================

const cartItemSelect = {
  id: true,
  quantity: true,
  price: true,
  createdAt: true,
  variant: {
    select: {
      id: true,
      sku: true,
      color: true,
      price: true,
      comparePrice: true,
      quantity: true,
      isActive: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
          storage: true,
        },
      },
    },
  },
};

const formatCart = (cart) => {
  const items = cart.cartItems.map((item) => ({
    ...item,
    isPriceChanged: item.price !== item.variant.price,
    isAvailable: item.variant.isActive && item.variant.quantity > 0,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, subtotal, totalItems };
};

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
  const variant = await prisma.variant.findUnique({
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

  // Tạo cart nếu chưa có
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  // Nếu item đã có trong cart thì cộng thêm số lượng
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (newQty > variant.quantity) {
      throw new Error(`Sản phẩm chỉ còn ${variant.quantity} trong kho`);
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty, price: variant.price },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
        price: variant.price,
      },
    });
  }

  return getCartService(userId);
};

// ========================
// UPDATE CART ITEM
// ========================

export const updateCartItemService = async (userId, itemId, quantity) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: parseInt(itemId),
      cart: { userId },
    },
    select: {
      id: true,
      variant: { select: { quantity: true, price: true } },
    },
  });

  if (!item) throw new Error("Sản phẩm không có trong giỏ hàng");

  if (quantity > item.variant.quantity) {
    throw new Error(`Sản phẩm chỉ còn ${item.variant.quantity} trong kho`);
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity, price: item.variant.price },
  });

  return getCartService(userId);
};

// ========================
// REMOVE CART ITEM
// ========================

export const removeCartItemService = async (userId, itemId) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: parseInt(itemId),
      cart: { userId },
    },
  });

  if (!item) throw new Error("Sản phẩm không có trong giỏ hàng");

  await prisma.cartItem.delete({ where: { id: item.id } });

  return getCartService(userId);
};

// ========================
// CLEAR CART
// ========================

export const clearCartService = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};
