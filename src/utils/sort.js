import { getMinPrice, getTotalSold } from "./product.js";

export const applySortInMemory = (items, sort) => {
  const sorted = [...items];

  if (sort === "price-asc") {
    sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
  }

  if (sort === "price-desc") {
    sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
  }

  if (sort === "best-seller") {
    sorted.sort((a, b) => getTotalSold(b) - getTotalSold(a));
  }

  return sorted;
};
