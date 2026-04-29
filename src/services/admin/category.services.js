import prisma from "../../config/client.js";
import { generateSlug } from "../../utils/slug.js";
import { NotFoundError, ConflictError } from "../../utils/AppError.js";
import { adminCategorySelect } from "../../select/category.select.js";
import {
  getAll,
  getById,
  deleteWithFile,
} from "../../services/common/base.services.js";
import { cleanupOldFile } from "../common/file.helper.js";
import { ROLE } from "../../constants/index.js";
export const getCategoriesServices = (query) => {
  return getAll(prisma.category, query, {
    orderBy: { id: "desc" },
    select: adminCategorySelect,
  });
};

export const getCategoryByIdServices = (id) => {
  return getById(
    prisma.category,
    id,
    { select: adminCategorySelect },
    "danh mục",
  );
};

export const createCategoryServices = async (data) => {
  const existed = await prisma.category.findUnique({
    where: { name: data.name },
  });
  if (existed) throw new ConflictError("Tên danh mục đã tồn tại");

  const baseSlug = generateSlug(data.name);

  const slugConflict = await prisma.category.findUnique({
    where: { slug: baseSlug },
  });

  const slug = slugConflict ? `${baseSlug}-${Date.now()}` : baseSlug;

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      icon: data.icon || null,
      iconId: data.iconId || null,
    },
    select: adminCategorySelect,
  });
};

export const updateCategoryServices = async (id, data) => {
  id = Number(id);

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new NotFoundError("Danh mục");

  if (data.name && data.name !== category.name) {
    const duplicated = await prisma.category.findUnique({
      where: { name: data.name },
    });
    if (duplicated) throw new ConflictError("Tên danh mục đã tồn tại");
  }

  let slug = category.slug;

  if (data.name) {
    const baseSlug = generateSlug(data.name);

    const slugConflict = await prisma.category.findFirst({
      where: {
        slug: baseSlug,
        NOT: { id },
      },
    });

    slug = slugConflict ? `${baseSlug}-${Date.now()}` : baseSlug;
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: data.name ?? category.name,
      slug,
      icon: data.icon ?? category.icon,
      iconId: data.iconId ?? category.iconId,
    },
    select: adminCategorySelect,
  });

  cleanupOldFile(category.iconId, data.iconId, { role: ROLE.ADMIN }, "icon");

  return updated;
};

export const deleteCategoryServices = async (id) => {
  id = Number(id);

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    throw new ConflictError(
      `Không thể xoá — danh mục đang chứa ${productCount} sản phẩm`,
    );
  }

  return deleteWithFile(
    prisma.category,
    id,
    "iconId",
    { role: ROLE.ADMIN },
    "danh mục",
  );
};
