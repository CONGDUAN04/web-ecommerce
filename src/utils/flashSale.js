export const getFlashSalePrice = (variant, now) => {
  const currentTime = now ?? new Date();

  const flash = variant.flashSaleItems?.find((f) => {
    const start = new Date(f.flashSale.startTime);
    const end = new Date(f.flashSale.endTime);

    return (
      f.flashSale.isActive &&
      start <= currentTime &&
      end >= currentTime &&
      f.quantity > f.sold
    );
  });

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
