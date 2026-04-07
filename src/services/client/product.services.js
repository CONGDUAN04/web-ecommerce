import prisma from "../../config/client.js";
import { parsePagination, buildPagination } from "../../utils/pagination.js";
import { attachReviewStats } from "../../utils/review.js";
import { applySortInMemory } from "../../utils/sort.js";
import { productSelect } from "../../constants/product.select.js";
import { NotFoundError } from "../../utils/AppError.js";
import { getFlashSalePrice } from "../../utils/flashSale.js";

/* ──────────────────────────────────────────────────────────
   APPLY FLASH SALE
────────────────────────────────────────────────────────── */
const applyFlashSale = (products) => {
  return products.map((p) => ({
    ...p,
    variants: p.variants?.map((v) => {
      const { price, originalPrice, isFlashSale } = getFlashSalePrice(v);

      return {
        ...v,
        price,
        originalPrice,
        isFlashSale,
      };
    }),
  }));
};

/* ──────────────────────────────────────────────────────────
   GET PRODUCTS
────────────────────────────────────────────────────────── */
export const getProductsService = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const { categoryId, brandId, groupId, storage, sort = "newest" } = query;

  const where = {
    isActive: true,
    ...(categoryId && { categoryId: parseInt(categoryId) }),
    ...(brandId && { brandId: parseInt(brandId) }),
    ...(groupId && { groupId: parseInt(groupId) }),
    ...(storage && { storage: parseInt(storage) }),
  };

  const dbOrderBy = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    popular: { viewCount: "desc" },
  }[sort] || { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productSelect,
      orderBy: dbOrderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const withFlash = applyFlashSale(items);

  return {
    items: applySortInMemory(attachReviewStats(withFlash), sort),
    pagination: buildPagination(total, page, limit),
  };
};

/* ──────────────────────────────────────────────────────────
   GET PRODUCT BY SLUG
────────────────────────────────────────────────────────── */
export const getProductBySlugService = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      ...productSelect,
      description: true,
      images: {
        select: { id: true, imageUrl: true, sortOrder: true },
        orderBy: { sortOrder: "asc" },
      },
      specifications: {
        select: { id: true, name: true, value: true },
      },
    },
  });

  if (!product) throw new NotFoundError("Sản phẩm");

  prisma.product
    .update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  const [result] = attachReviewStats(applyFlashSale([product]));
  return result;
};

/* ──────────────────────────────────────────────────────────
   SEARCH PRODUCTS
────────────────────────────────────────────────────────── */
export const searchProductsService = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const { q = "" } = query;

  if (!q.trim()) {
    return { items: [], pagination: buildPagination(0, page, limit) };
  }

  const where = {
    isActive: true,
    OR: [
      { name: { contains: q } },
      { brand: { name: { contains: q } } },
      { group: { name: { contains: q } } },
      { group: { series: { contains: q } } },
    ],
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productSelect,
      orderBy: { viewCount: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: attachReviewStats(applyFlashSale(items)),
    pagination: buildPagination(total, page, limit),
  };
};

/* ──────────────────────────────────────────────────────────
   RELATED PRODUCTS
────────────────────────────────────────────────────────── */
export const getRelatedProductsService = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true, groupId: true, categoryId: true, brandId: true },
  });

  if (!product) throw new NotFoundError("Sản phẩm");

  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      groupId: product.groupId,
    },
    select: productSelect,
    orderBy: { viewCount: "desc" },
    take: 8,
  });

  return attachReviewStats(applyFlashSale(related));
};

/* ──────────────────────────────────────────────────────────
   GET PRODUCT GROUPS
────────────────────────────────────────────────────────── */
export const getProductGroupsService = async () => {
  return prisma.productGroup.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      series: true,
    },
  });
};

/* ──────────────────────────────────────────────────────────
   GET PRODUCT GROUP BY SLUG
────────────────────────────────────────────────────────── */
export const getProductGroupBySlugService = async (slug) => {
  const group = await prisma.productGroup.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, series: true },
  });

  if (!group) throw new NotFoundError("Nhóm sản phẩm");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      groupId: group.id,
    },
    select: productSelect,
    orderBy: { viewCount: "desc" },
  });

  return {
    group,
    items: attachReviewStats(applyFlashSale(products)),
  };
};
