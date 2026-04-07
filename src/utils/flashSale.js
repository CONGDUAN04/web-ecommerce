export const getFlashSalePrice = (variant) => {
  const now = new Date();

  const flash = variant.flashSaleItems?.find(
    (f) =>
      f.flashSale.isActive &&
      new Date(f.flashSale.startTime) <= now &&
      new Date(f.flashSale.endTime) >= now &&
      f.quantity > f.sold,
  );

  if (!flash) {
    return {
      price: variant.price,
      originalPrice: null,
      isFlashSale: false,
    };
  }

  return {
    price: flash.salePrice,
    originalPrice: variant.price,
    isFlashSale: true,
  };
};
