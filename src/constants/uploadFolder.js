export const UPLOAD_TYPES = {
  brand: { folder: "brands", requiresAdmin: true },
  category: { folder: "categories", requiresAdmin: true },
  product: { folder: "products", requiresAdmin: true },
  productGroup: { folder: "productGroups", requiresAdmin: true },
  user: { folder: "avatars", requiresAdmin: false },
  banner: { folder: "banners", requiresAdmin: true },
  slider: { folder: "sliders", requiresAdmin: true },
  return: { folder: "returns", requiresAdmin: false },
  review: { folder: "reviews", requiresAdmin: false },
};
export const UPLOAD_TYPE_KEYS = Object.keys(UPLOAD_TYPES);
