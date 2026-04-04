import prisma from "../../config/client.js";
import { parsePagination, buildPagination } from "../../utils/pagination.js";
import { attachReviewStats } from "../../utils/review.js";
import { applySortInMemory } from "../../utils/sort.js";
import { productSelect } from "../../constants/product.select.js";
import { NotFoundError } from "../../utils/AppError.js";

export const getProductsService = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const {
    categoryId,
    brandId,
    groupId,
    minPrice,
    maxPrice,
    storage,
    sort = "newest",
  } = query;

  const where = {
    isActive: true,
    ...(categoryId && { categoryId: parseInt(categoryId) }),
    ...(brandId && { brandId: parseInt(brandId) }),
    ...(groupId && { groupId: parseInt(groupId) }),
    ...(storage && { storage: parseInt(storage) }),
    ...(minPrice || maxPrice
      ? {
          variants: {
            some: {
              isActive: true,
              ...(minPrice && { price: { gte: parseInt(minPrice) } }),
              ...(maxPrice && { price: { lte: parseInt(maxPrice) } }),
            },
          },
        }
      : {}),
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

  return {
    items: applySortInMemory(attachReviewStats(items), sort),
    pagination: buildPagination(total, page, limit),
  };
};

export const getProductBySlugService = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      ...productSelect,
      isActive: true,
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

  if (!product || !product.isActive) throw new NotFoundError("Sản phẩm");

  prisma.product
    .update({ where: { slug }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  const [result] = attachReviewStats([product]);
  return result;
};

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
      { description: { contains: q } },
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
    items: attachReviewStats(items),
    pagination: buildPagination(total, page, limit),
  };
};

export const getRelatedProductsService = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true, groupId: true, categoryId: true, brandId: true },
  });

  if (!product) throw new NotFoundError("Sản phẩm");

  let related = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      groupId: product.groupId,
    },
    select: productSelect,
    orderBy: { viewCount: "desc" },
    take: 8,
  });

  if (related.length < 8) {
    const exclude = [product.id, ...related.map((p) => p.id)];
    const more = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: exclude },
        brandId: product.brandId,
        categoryId: product.categoryId,
      },
      select: productSelect,
      orderBy: { viewCount: "desc" },
      take: 8 - related.length,
    });
    related = [...related, ...more];
  }

  if (related.length < 8) {
    const exclude = [product.id, ...related.map((p) => p.id)];
    const more = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: exclude },
        categoryId: product.categoryId,
      },
      select: productSelect,
      orderBy: { viewCount: "desc" },
      take: 8 - related.length,
    });
    related = [...related, ...more];
  }

  return attachReviewStats(related);
};

export const getProductGroupsService = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const { categoryId, brandId } = query;

  const where = {
    isActive: true,
    ...(categoryId && { categoryId: parseInt(categoryId) }),
    ...(brandId && { brandId: parseInt(brandId) }),
  };

  const [items, total] = await Promise.all([
    prisma.productGroup.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        series: true,
        thumbnail: true,
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        category: { select: { id: true, name: true, slug: true } },
        products: {
          where: { isActive: true },
          select: {
            variants: {
              where: { isActive: true },
              select: { price: true, comparePrice: true },
              orderBy: { price: "asc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.productGroup.count({ where }),
  ]);

  const formatted = items.map((g) => {
    const allPrices = g.products.flatMap((p) => p.variants).map((v) => v.price);
    const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;
    const { products, ...rest } = g;
    return { ...rest, minPrice };
  });

  return { items: formatted, pagination: buildPagination(total, page, limit) };
};

export const getProductGroupBySlugService = async (slug, query = {}) => {
  const { storage, color, minPrice, maxPrice } = query;

  const group = await prisma.productGroup.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      series: true,
      description: true,
      thumbnail: true,
      isActive: true,
      brand: { select: { id: true, name: true, slug: true, logo: true } },
      category: { select: { id: true, name: true, slug: true } },
      products: {
        where: { isActive: true },
        select: {
          ...productSelect,
          description: true,
          images: {
            select: { id: true, imageUrl: true, sortOrder: true },
            orderBy: { sortOrder: "asc" },
          },
          specifications: { select: { id: true, name: true, value: true } },
        },
        orderBy: { storage: "asc" },
      },
    },
  });

  if (!group || !group.isActive) throw new NotFoundError("Dòng sản phẩm");

  const storageOptions = [
    ...new Set(group.products.map((p) => p.storage).filter(Boolean)),
  ].sort((a, b) => a - b);

  const colorOptions = [
    ...new Set(group.products.flatMap((p) => p.variants.map((v) => v.color))),
  ];

  let products = group.products;

  if (storage) {
    products = products.filter((p) => p.storage === parseInt(storage));
  }

  products = products.map((p) => {
    let variants = p.variants;
    if (color)
      variants = variants.filter((v) =>
        v.color.toLowerCase().includes(color.toLowerCase()),
      );
    if (minPrice)
      variants = variants.filter((v) => v.price >= parseInt(minPrice));
    if (maxPrice)
      variants = variants.filter((v) => v.price <= parseInt(maxPrice));
    return { ...p, variants };
  });

  const { isActive, ...rest } = group;

  return {
    ...rest,
    products: attachReviewStats(products),
    filterOptions: { storageOptions, colorOptions },
  };
};
