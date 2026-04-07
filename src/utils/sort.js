import { getMinPrice, getTotalSold } from "./product.js";

export const applySortInMemory = (items, sort) => {
  // 👉 nếu không có sort → trả luôn
  if (!sort) return items;

  // 👉 clone để tránh mutate data gốc
  const sorted = [...items];

  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
      break;

    case "price-desc":
      sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
      break;

    case "best-seller":
      sorted.sort((a, b) => getTotalSold(b) - getTotalSold(a));
      break;

    default:
      return items;
  }

  return sorted;
};
