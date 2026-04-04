import prisma from "../../config/client.js";
import { NotFoundError } from "../../utils/AppError.js";

export const getWishlistService = async (userId) => {
  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return wishlist;
};

export const addToWishlistService = async (userId, { productId }) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, isActive: true },
  });
  if (!product || !product.isActive)
    throw new NotFoundError("Sản phẩm không tồn tại hoặc đã ngừng kinh doanh");

  const wishlist = await prisma.wishlist.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
  });

  return getWishlistService(userId);
};

export const removeFromWishlistService = async (userId, productId) => {
  await prisma.wishlist.deleteMany({
    where: { userId, productId: parseInt(productId) },
  });
  return getWishlistService(userId);
};

export const checkWishlistService = async (userId, productId) => {
  const exists = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId: parseInt(productId) } },
  });
  return !!exists; //Chuyển đổi thành boolean để trả về true/false thay vì object hoặc null
};
