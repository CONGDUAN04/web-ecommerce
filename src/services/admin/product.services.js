import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import { generateSlug } from "../../utils/slug.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";

const productInclude = {
  brand: { select: { id: true, name: true, slug: true, logo: true } },
  category: { select: { id: true, name: true, slug: true } },
  group: { select: { id: true, name: true, slug: true, series: true } },
};

export const getProductsServices = async ({
  page = 1,
  limit = 10,
  groupId,
  brandId,
  categoryId,
  search,
}) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const where = { isActive: true };
  if (groupId) where.groupId = Number(groupId);
  if (brandId) where.brandId = Number(brandId);
  if (categoryId) where.categoryId = Number(categoryId);
  if (search) where.name = { contains: search };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: l,
      orderBy: { createdAt: "desc" },
      include: {
        ...productInclude,
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            color: true,
            price: true,
            comparePrice: true,
            quantity: true,
          },
          orderBy: { price: "asc" },
        },
        _count: { select: { variants: true, reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  };
};

export const getProductByIdServices = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      ...productInclude,
      variants: {
        where: { isActive: true },
        orderBy: [{ price: "asc" }, { color: "asc" }],
      },
      images: { orderBy: { sortOrder: "asc" } },
      specifications: true,
      _count: { select: { reviews: true } },
    },
  });

  if (!product) throw new NotFoundError("Sản phẩm");
  return product;
};

export const getProductBySlugServices = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ...productInclude,
      variants: {
        where: { isActive: true },
        orderBy: [{ color: "asc" }],
      },
      images: { orderBy: { sortOrder: "asc" } },
      specifications: true,
      _count: { select: { reviews: true } },
    },
  });

  if (!product) throw new NotFoundError("Sản phẩm");

  await prisma.product.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });

  return product;
};

export const createProductServices = async (data, thumbnail) => {
  const slug = generateSlug(data.name);

  const exist = await prisma.product.findUnique({ where: { slug } });
  if (exist) throw new ConflictError("Tên sản phẩm đã tồn tại");

  const group = await prisma.productGroup.findUnique({
    where: { id: Number(data.groupId) },
  });
  if (!group) throw new NotFoundError("Product group");
  if (!group.isActive) throw new ValidationError("Product group đã bị ẩn");

  return prisma.product.create({
    data: {
      name: data.name,
      slug,
      storage: data.storage,
      groupId: group.id,
      brandId: group.brandId,
      categoryId: group.categoryId,
      description: data.description ?? null,
      thumbnail: thumbnail ?? null,
    },
    include: productInclude,
  });
};

export const updateProductServices = async (id, data, thumbnail) => {
  id = Number(id);

  const exist = await prisma.product.findUnique({ where: { id } });
  if (!exist) throw new NotFoundError("Sản phẩm");

  const updateData = {};

  if (data.name) {
    const slug = generateSlug(data.name);
    const duplicated = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (duplicated) throw new ConflictError("Tên sản phẩm đã tồn tại");
    updateData.name = data.name;
    updateData.slug = slug;
  }

  if (data.groupId !== undefined) {
    const group = await prisma.productGroup.findUnique({
      where: { id: Number(data.groupId) },
    });
    if (!group) throw new NotFoundError("Product group");
    if (!group.isActive) throw new ValidationError("Product group đã bị ẩn");

    updateData.groupId = group.id;
    updateData.brandId = group.brandId;
    updateData.categoryId = group.categoryId;
  }

  if (data.storage !== undefined) updateData.storage = data.storage;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  if (Object.keys(updateData).length === 0 && !thumbnail) {
    throw new ValidationError("Cần ít nhất một trường để cập nhật");
  }

  return prisma.product.update({
    where: { id },
    data: { ...updateData, thumbnail: thumbnail ?? updateData.thumbnail },
    include: productInclude,
  });
};

export const deleteProductServices = async (id) => {
  id = Number(id);

  const exist = await prisma.product.findUnique({ where: { id } });
  if (!exist) throw new NotFoundError("Sản phẩm");

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  return true;
};
