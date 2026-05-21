const calcDiscountPercent = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

export const transformHomeProducts = (products) => {
  const now = new Date();

  return products.map((p) => {
    const v = p.variants?.[0];

    let price = v?.price || 0;
    let comparePrice = v?.comparePrice || 0;

    const flash = v?.flashSaleItems?.[0];

    let isFlashSale = false;
    let flashPrice = null;

    if (
      flash?.flashSale &&
      new Date(flash.flashSale.startTime) <= now &&
      new Date(flash.flashSale.endTime) >= now
    ) {
      price = flash.salePrice;
      flashPrice = flash.salePrice;
      isFlashSale = true;
    }

    const discountPercent = calcDiscountPercent(price, comparePrice);

    const isNew =
      (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24) <=
      30;

    const ratings = (p.reviews ?? []).map((r) => r.rating);
    const avgRating = ratings.length
      ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;

    return {
      id: p.id,
      name: v?.storage ? `${p.name} ${v.storage}` : p.name,
      slug: p.slug,
      thumbnail: p.thumbnail,

      price,
      comparePrice,
      flashPrice,
      flashSaleEndTime: flash?.flashSale?.endTime || null,
      brand: p.brand,
      category: p.category,

      rating: {
        average: avgRating,
        count: ratings.length,
      },

      badges: {
        isNew,
        isFlashSale,
        isInstallment: true,
        discountPercent,
      },
    };
  });
};
