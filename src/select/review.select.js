export const clientReviewSelect = {
  id: true,
  rating: true,
  comment: true,
  isVerifiedPurchase: true,
  createdAt: true,
  user: {
    select: { id: true, fullName: true, avatar: true },
  },
  images: {
    select: { id: true, imageUrl: true },
  },
  replies: {
    select: {
      id: true,
      comment: true,
      createdAt: true,
      user: { select: { id: true, fullName: true, avatar: true } },
    },
    orderBy: { createdAt: "asc" },
  },
};

export const clientSortMap = {
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  rating_asc: { rating: "asc" },
  rating_desc: { rating: "desc" },
};
