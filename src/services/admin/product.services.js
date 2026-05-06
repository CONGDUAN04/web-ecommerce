import prisma from "../../config/client.js";
import { generateSlug } from "../../utils/slug.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";
import { getAll, getById, deleteWithFile } from "../common/base.services.js";
import { adminProductSelect } from "../../select/product.select.js";
import { cleanupOldFile } from "../common/file.helper.js";
import { ROLE } from "../../constants/index.js";

export const getProductsServices = (query) => {
  const { groupId, brandId, categoryId, search, isActive } = query;

  const where = {
    ...(isActive !== undefined && {
      isActive: isActive === "true",
    }),
    ...(groupId && { groupId: Number(groupId) }),
    ...(brandId && { brandId: Number(brandId) }),
    ...(categoryId && { categoryId: Number(categoryId) }),
    ...(search && {
      name: { contains: search },
    }),
  };

  return getAll(prisma.product, query, {
    where,
    orderBy: { id: "desc" },
    select: adminProductSelect,
  });
};

export const getProductByIdServices = (id) => {
  return getById(
    prisma.product,
    id,
    {
      select: adminProductSelect,
    },
    "product",
  );
};

export const getProductBySlugServices = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: adminProductSelect,
  });

  if (!product) throw new NotFoundError("Sản phẩm");

  await prisma.product.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });

  return product;
};

export const createProductServices = async (data) => {
  if (!data.name || !data.groupId) {
    throw new ValidationError("Thiếu dữ liệu bắt buộc");
  }

  const slug = generateSlug(data.name);

  const exist = await prisma.product.findFirst({
    where: { slug },
  });

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
      storage: data.storage?.trim() || null,
      groupId: group.id,
      brandId: group.brandId,
      categoryId: group.categoryId,
      description: data.description ?? null,
      thumbnail: data.thumbnail ?? null,
      thumbnailId: data.thumbnailId ?? null,
    },
    select: adminProductSelect,
  });
};

export const updateProductServices = async (id, data) => {
  id = Number(id);

  const exist = await prisma.product.findUnique({ where: { id } });
  if (!exist) throw new NotFoundError("Product");

  if (data.name && data.name !== exist.name) {
    const duplicated = await prisma.product.findFirst({
      where: {
        slug: generateSlug(data.name),
        NOT: { id },
      },
    });

    if (duplicated) {
      throw new ConflictError("Tên sản phẩm đã tồn tại");
    }
  }

  if (data.groupId) {
    const group = await prisma.productGroup.findUnique({
      where: { id: Number(data.groupId) },
    });

    if (!group) throw new NotFoundError("Product group");
    if (!group.isActive) throw new ValidationError("Product group đã bị ẩn");
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: data.name ?? exist.name,
      slug: data.name ? generateSlug(data.name) : exist.slug,
      storage:
        data.storage !== undefined
          ? data.storage?.trim() || null
          : exist.storage,
      description:
        data.description !== null && data.description !== undefined
          ? data.description
          : exist.description,
      groupId: data.groupId ? Number(data.groupId) : exist.groupId,
      brandId: data.groupId ? undefined : exist.brandId,
      categoryId: data.groupId ? undefined : exist.categoryId,
      thumbnail: data.thumbnail ?? exist.thumbnail,
      thumbnailId: data.thumbnailId ?? exist.thumbnailId,
      isActive:
        data.isActive !== undefined ? Boolean(data.isActive) : exist.isActive,
    },
    select: adminProductSelect,
  });

  cleanupOldFile(
    exist.thumbnailId,
    data.thumbnailId,
    { role: ROLE.ADMIN },
    "thumbnail",
  );

  return updated;
};

export const deleteProductServices = async (id) => {
  id = Number(id);

  const exist = await prisma.product.findUnique({
    where: { id },
  });

  if (!exist) throw new NotFoundError("Product");

  return deleteWithFile(
    prisma.product,
    id,
    "thumbnailId",
    { role: ROLE.ADMIN },
    "Sản phẩm",
  );
};

export const updateProductStatusService = async (id, data) => {
  id = Number(id);

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) throw new NotFoundError("Product");

  return prisma.product.update({
    where: { id },
    data: {
      isActive: data.isActive,
    },
  });
};
