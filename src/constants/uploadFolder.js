export const UPLOAD_TYPES = {
  brand: { folder: "brands", requiresAdmin: true },
  product: { folder: "products", requiresAdmin: true },
  avatar: { folder: "avatars", requiresAdmin: false },
  banner: { folder: "banners", requiresAdmin: true },
  slider: { folder: "sliders", requiresAdmin: true },
  return: { folder: "returns", requiresAdmin: false },
  review: { folder: "reviews", requiresAdmin: false },
};
export const UPLOAD_TYPE_KEYS = Object.keys(UPLOAD_TYPES);
