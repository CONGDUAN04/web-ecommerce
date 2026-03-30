export const attachReviewStats = (products) =>
  products.map((p) => {
    const ratings = p.reviews.map((r) => r.rating);

    const avgRating =
      ratings.length > 0
        ? parseFloat(
            (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
          )
        : 0;

    const { reviews, ...rest } = p;

    return {
      ...rest,
      avgRating,
      reviewCount: ratings.length,
    };
  });
