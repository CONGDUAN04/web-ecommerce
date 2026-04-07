export const formatCart = (cart) => {
  const items = cart.cartItems.map((item) => ({
    ...item,
    isPriceChanged: item.price !== item.variant.price,
    isAvailable: item.variant.isActive && item.variant.quantity > 0,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, subtotal, totalItems };
};
