export const getMinPrice = (p) =>
  p.variants.length > 0 ? Math.min(...p.variants.map((v) => v.price)) : 0;

export const getTotalSold = (p) =>
  p.variants.reduce((sum, v) => sum + v.sold, 0);
