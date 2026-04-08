import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import { generateSlug } from "../../utils/slug.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";

import {
  adminProductGroupInclude,
  adminProductGroupFullInclude,
} from "../../select/productGroup.select.js";

export const getProductGroupsServices = async ({
  page = 1,
  limit = 10,
  series,
  brandId,
  categoryId,
}) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const where = {
    isActive: true,
    ...(series && { series }),
    ...(brandId && { brandId: Number(brandId) }),
    ...(categoryId && { categoryId: Number(categoryId) }),
  };

  const [items, total] = await Promise.all([
    prisma.productGroup.findMany({
      where,
      skip,
      take: l,
      orderBy: { id: "desc" },
      include: adminProductGroupFullInclude,
    }),
    prisma.productGroup.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
    },
  };
};

/**
 * GET DETAIL
 */
export const getProductGroupByIdServices = async (id) => {
  const productGroup = await prisma.productGroup.findUnique({
    where: { id: Number(id) },
    include: {
      ...adminProductGroupInclude,
      products: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
          isActive: true,
          createdAt: true,
          _count: { select: { variants: true } },
        },
      },
    },
  });

  if (!productGroup) throw new NotFoundError("Product group");
  return productGroup;
};

/**
 * CREATE
 */
export const createProductGroupServices = async (data, thumbnail) => {
  const { name, brandId, categoryId, series, description } = data;

  if (!name || !brandId || !categoryId) {
    throw new ValidationError("Thiếu dữ liệu bắt buộc");
  }

  const slug = generateSlug(name);

  // check slug duplicate
  const exist = await prisma.productGroup.findUnique({ where: { slug } });
  if (exist) throw new ConflictError("Tên product group đã tồn tại");

  // check brand & category song song (tối ưu)
  const [brand, category] = await Promise.all([
    prisma.brand.findUnique({ where: { id: Number(brandId) } }),
    prisma.category.findUnique({ where: { id: Number(categoryId) } }),
  ]);

  if (!brand) throw new NotFoundError("Brand");
  if (!category) throw new NotFoundError("Category");

  return prisma.productGroup.create({
    data: {
      name,
      slug,
      series: series ?? null,
      description: description ?? null,
      brandId: Number(brandId),
      categoryId: Number(categoryId),
      thumbnail: thumbnail ?? null,
    },
    include: adminProductGroupInclude,
  });
};

/**
 * UPDATE
 */
export const updateProductGroupServices = async (id, data, thumbnail) => {
  id = Number(id);

  const exist = await prisma.productGroup.findUnique({ where: { id } });
  if (!exist) throw new NotFoundError("Product group");

  const updateData = {};

  // update name + slug
  if (data.name) {
    const slug = generateSlug(data.name);

    const duplicated = await prisma.productGroup.findFirst({
      where: { slug, NOT: { id } },
    });

    if (duplicated) throw new ConflictError("Tên product group đã tồn tại");

    updateData.name = data.name;
    updateData.slug = slug;
  }

  // update brand
  if (data.brandId !== undefined) {
    const brand = await prisma.brand.findUnique({
      where: { id: Number(data.brandId) },
    });
    if (!brand) throw new NotFoundError("Brand");

    updateData.brandId = Number(data.brandId);
  }

  // update category
  if (data.categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: { id: Number(data.categoryId) },
    });
    if (!category) throw new NotFoundError("Category");

    updateData.categoryId = Number(data.categoryId);
  }

  // optional fields
  if (data.series !== undefined) updateData.series = data.series;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  // thumbnail (FIX BUG)
  if (thumbnail !== undefined) {
    updateData.thumbnail = thumbnail;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError("Cần ít nhất một trường để cập nhật");
  }

  return prisma.productGroup.update({
    where: { id },
    data: updateData,
    include: adminProductGroupInclude,
  });
};

/**
 * DELETE (SOFT DELETE)
 */
export const deleteProductGroupServices = async (id) => {
  id = Number(id);

  const exist = await prisma.productGroup.findUnique({ where: { id } });
  if (!exist) throw new NotFoundError("Product group");

  const productCount = await prisma.product.count({
    where: { groupId: id },
  });

  if (productCount > 0) {
    throw new ConflictError(
      `Không thể xóa — product group đang chứa ${productCount} sản phẩm`,
    );
  }

  await prisma.productGroup.update({
    where: { id },
    data: { isActive: false },
  });

  return true;
};
