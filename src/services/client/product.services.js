import prisma from "../../config/client.js";
import { parsePagination, buildPagination } from "../../utils/pagination.js";
import { attachReviewStats } from "../../utils/review.js";
import { applySortInMemory } from "../../utils/sort.js";
import { clientProductSelect } from "../../select/product.select.js";
import { NotFoundError } from "../../utils/AppError.js";
import { getFlashSalePrice } from "../../utils/flashSale.js";

/* ─────────────────────────────────────────────
   TRANSFORM PRODUCTS (🔥 CORE PIPELINE)
───────────────────────────────────────────── */
const transformProducts = (products, sort) => {
  const now = new Date();

  const withFlash = products.map((p) => ({
    ...p,
    variants: p.variants?.map((v) => {
      const { price, originalPrice, isFlashSale } = getFlashSalePrice(v, now);

      return {
        ...v,
        price,
        originalPrice,
        isFlashSale,
      };
    }),
  }));

  return applySortInMemory(attachReviewStats(withFlash), sort);
};

/* ─────────────────────────────────────────────
   GET PRODUCTS
───────────────────────────────────────────── */
export const getProductsService = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const { categoryId, brandId, groupId, storage, sort = "newest" } = query;

  const where = {
    isActive: true,
    ...(categoryId && { categoryId: Number(categoryId) }),
    ...(brandId && { brandId: Number(brandId) }),
    ...(groupId && { groupId: Number(groupId) }),
    ...(storage && { storage: Number(storage) }),
  };

  const dbOrderBy = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    popular: { viewCount: "desc" },
  }[sort] || { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: clientProductSelect,
      orderBy: dbOrderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: transformProducts(items, sort),
    pagination: buildPagination(total, page, limit),
  };
};

/* ─────────────────────────────────────────────
   GET PRODUCT BY SLUG
───────────────────────────────────────────── */
export const getProductBySlugService = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      ...clientProductSelect,
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

  // update view không block
  prisma.product
    .update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  const [result] = transformProducts([product], "newest");
  return result;
};

/* ─────────────────────────────────────────────
   SEARCH PRODUCTS
───────────────────────────────────────────── */
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
      select: clientProductSelect,
      orderBy: { viewCount: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: transformProducts(items, "popular"),
    pagination: buildPagination(total, page, limit),
  };
};

/* ─────────────────────────────────────────────
   RELATED PRODUCTS
───────────────────────────────────────────── */
export const getRelatedProductsService = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true, groupId: true },
  });

  if (!product) throw new NotFoundError("Sản phẩm");

  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      groupId: product.groupId,
    },
    select: clientProductSelect,
    orderBy: { viewCount: "desc" },
    take: 8,
  });

  return transformProducts(related, "popular");
};

/* ─────────────────────────────────────────────
   GET PRODUCT GROUPS
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   GET PRODUCT GROUP BY SLUG
───────────────────────────────────────────── */
export const getProductGroupBySlugService = async (slug) => {
  const group = await prisma.productGroup.findUnique({
    where: { slug },
  });

  if (!group) throw new NotFoundError("Nhóm sản phẩm");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      groupId: group.id,
    },
    select: clientProductSelect,
    orderBy: { viewCount: "desc" },
  });

  return {
    group,
    items: transformProducts(products, "popular"),
  };
};
