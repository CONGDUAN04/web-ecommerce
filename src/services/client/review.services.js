import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
  ValidationError,
} from "../../utils/AppError.js";
import {
  clientReviewSelect,
  clientSortMap,
} from "../../select/review.select.js";

const checkVerifiedPurchase = async (userId, productId) => {
  const purchased = await prisma.orderItem.findFirst({
    where: {
      variantId: { in: await getVariantIdsByProduct(productId) },
      order: {
        userId,
        status: "COMPLETED",
      },
    },
  });
  return !!purchased;
};

const getVariantIdsByProduct = async (productId) => {
  const variants = await prisma.variant.findMany({
    where: { productId: Number(productId) },
    select: { id: true },
  });
  return variants.map((v) => v.id);
};

export const getReviewsByProductServices = async (productId, query = {}) => {
  const { page = 1, limit = 10, rating, sort = "newest" } = query;
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  if (!product) throw new NotFoundError("Sản phẩm");

  const where = {
    productId: Number(productId),
    isHidden: false,
    ...(rating && { rating: Number(rating) }),
  };

  const [items, total, ratingStats] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: l,
      orderBy: clientSortMap[sort] ?? clientSortMap.newest,
      select: clientReviewSelect,
    }),
    prisma.review.count({ where }),
    // Thống kê rating
    prisma.review.groupBy({
      by: ["rating"],
      where: { productId: Number(productId), isHidden: false },
      _count: { rating: true },
    }),
  ]);

  // Tính average rating
  const allReviews = await prisma.review.aggregate({
    where: { productId: Number(productId), isHidden: false },
    _avg: { rating: true },
    _count: { id: true },
  });

  const stats = {
    average: allReviews._avg.rating
      ? Math.round(allReviews._avg.rating * 10) / 10
      : 0,
    total: allReviews._count.id,
    distribution: [5, 4, 3, 2, 1].reduce((acc, r) => {
      const found = ratingStats.find((s) => s.rating === r);
      acc[r] = found?._count.rating ?? 0;
      return acc;
    }, {}),
  };

  return {
    items,
    stats,
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
    },
  };
};

export const createReviewServices = async (userId, productId, data, files) => {
  productId = Number(productId);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundError("Sản phẩm");

  // Kiểm tra đã review chưa
  const existed = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existed) throw new ConflictError("Bạn đã đánh giá sản phẩm này rồi");

  const isVerifiedPurchase = await checkVerifiedPurchase(userId, productId);

  const imageUrls =
    files?.map((f) => ({ imageUrl: `images/review/${f.filename}` })) ?? [];

  const review = await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment ?? null,
      isVerifiedPurchase,
      productId,
      userId,
      images: imageUrls.length > 0 ? { create: imageUrls } : undefined,
    },
    select: clientReviewSelect,
  });

  return review;
};

export const updateReviewServices = async (userId, reviewId, data, files) => {
  reviewId = Number(reviewId);

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new NotFoundError("Đánh giá");
  if (review.userId !== userId)
    throw new ForbiddenError("Bạn không có quyền sửa đánh giá này");

  const updateData = {};
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.comment !== undefined) updateData.comment = data.comment;

  // Nếu upload ảnh mới → xóa ảnh cũ, thêm ảnh mới
  if (files && files.length > 0) {
    await prisma.reviewImage.deleteMany({ where: { reviewId } });
    updateData.images = {
      create: files.map((f) => ({ imageUrl: `images/review/${f.filename}` })),
    };
  }

  if (Object.keys(updateData).length === 0)
    throw new ValidationError("Cần ít nhất một trường để cập nhật");

  return prisma.review.update({
    where: { id: reviewId },
    data: updateData,
    select: clientReviewSelect,
  });
};

export const deleteReviewServices = async (userId, reviewId) => {
  reviewId = Number(reviewId);

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new NotFoundError("Đánh giá");
  if (review.userId !== userId)
    throw new ForbiddenError("Bạn không có quyền xóa đánh giá này");

  await prisma.review.delete({ where: { id: reviewId } });
  return true;
};

export const createReplyServices = async (userId, reviewId, data) => {
  reviewId = Number(reviewId);

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new NotFoundError("Đánh giá");
  if (review.isHidden) throw new NotFoundError("Đánh giá");

  return prisma.reviewReply.create({
    data: {
      comment: data.comment,
      reviewId,
      userId,
    },
    select: {
      id: true,
      comment: true,
      createdAt: true,
      user: { select: { id: true, fullName: true, avatar: true } },
    },
  });
};

export const deleteReplyServices = async (userId, replyId) => {
  replyId = Number(replyId);

  const reply = await prisma.reviewReply.findUnique({ where: { id: replyId } });
  if (!reply) throw new NotFoundError("Reply");
  if (reply.userId !== userId)
    throw new ForbiddenError("Bạn không có quyền xóa reply này");

  await prisma.reviewReply.delete({ where: { id: replyId } });
  return true;
};
