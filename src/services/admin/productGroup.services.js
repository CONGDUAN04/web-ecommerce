import prisma from "../../config/client.js";
import { generateSlug } from "../../utils/slug.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";

import {
  getAll,
  getById,
  deleteWithFile,
} from "../../services/common/base.services.js";

import {
  adminProductGroupInclude,
  adminProductGroupFullInclude,
} from "../../select/productGroup.select.js";

import { cleanupOldFile } from "../common/file.helper.js";
import { ROLE } from "../../constants/index.js";
import e from "cors";

export const getProductGroupsServices = (query) => {
  const { series, brandId, categoryId, isActive } = query;

  const where = {
    ...(isActive !== undefined && {
      isActive: isActive === "true",
    }),
    ...(series && { series }),
    ...(brandId && { brandId: Number(brandId) }),
    ...(categoryId && { categoryId: Number(categoryId) }),
  };

  return getAll(prisma.productGroup, query, {
    where,
    orderBy: { id: "desc" },
    include: adminProductGroupFullInclude,
  });
};

export const getProductGroupByIdServices = (id) => {
  return getById(
    prisma.productGroup,
    id,
    {
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
    },
    "product group",
  );
};

export const createProductGroupServices = async (data) => {
  console.log(data);
  if (!data.name || !data.brandId || !data.categoryId) {
    throw new ValidationError("Thiếu dữ liệu bắt buộc");
  }

  const slug = generateSlug(data.name);

  const exist = await prisma.productGroup.findFirst({
    where: { slug },
  });

  if (exist) throw new ConflictError("Tên product group đã tồn tại");

  const [brand, category] = await Promise.all([
    prisma.brand.findUnique({ where: { id: Number(data.brandId) } }),
    prisma.category.findUnique({ where: { id: Number(data.categoryId) } }),
  ]);

  if (!brand) throw new NotFoundError("Brand");
  if (!category) throw new NotFoundError("Category");

  return prisma.productGroup.create({
    data: {
      name: data.name,
      slug,
      series: data.series ?? null,
      description: data.description ?? null,
      brandId: Number(data.brandId),
      categoryId: Number(data.categoryId),
      thumbnail: data.thumbnail ?? null,
      thumbnailId: data.thumbnailId ?? null,
    },
  });
};
export const updateProductGroupServices = async (id, data) => {
  id = Number(id);

  const exist = await prisma.productGroup.findUnique({ where: { id } });
  if (!exist) throw new NotFoundError("Product group");

  if (data.name && data.name !== exist.name) {
    const duplicated = await prisma.productGroup.findFirst({
      where: {
        slug: generateSlug(data.name),
        NOT: { id },
      },
    });

    if (duplicated) {
      throw new ConflictError("Tên product group đã tồn tại");
    }
  }

  if (data.brandId) {
    const brand = await prisma.brand.findUnique({
      where: { id: Number(data.brandId) },
    });
    if (!brand) throw new NotFoundError("Brand");
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: Number(data.categoryId) },
    });
    if (!category) throw new NotFoundError("Category");
  }

  const updated = await prisma.productGroup.update({
    where: { id },
    data: {
      name: data.name ?? exist.name,
      slug: data.name ? generateSlug(data.name) : exist.slug,
      series: data.series ?? exist.series,
      description:
        data.description !== null && data.description !== undefined
          ? data.description
          : exist.description,
      brandId: data.brandId ? Number(data.brandId) : exist.brandId,
      categoryId: data.categoryId ? Number(data.categoryId) : exist.categoryId,
      thumbnail: data.thumbnail ?? exist.thumbnail,
      thumbnailId: data.thumbnailId ?? exist.thumbnailId,
    },
  });
  // 👇 ĐẶT DEBUG Ở ĐÂY
  console.log("=== UPDATE DONE ===");
  console.log("OLD thumbnailId:", exist.thumbnailId);
  console.log("NEW thumbnailId:", data.thumbnailId);

  cleanupOldFile(
    exist.thumbnailId,
    data.thumbnailId,
    { role: ROLE.ADMIN },
    "thumbnail",
  );

  return updated;
};
export const deleteProductGroupServices = async (id) => {
  id = Number(id);

  const exist = await prisma.productGroup.findUnique({
    where: { id },
  });

  if (!exist) throw new NotFoundError("Product group");

  const productCount = await prisma.product.count({
    where: { groupId: id },
  });

  if (productCount > 0) {
    throw new ConflictError(
      `Không thể xóa — product group đang chứa ${productCount} sản phẩm`,
    );
  }

  return deleteWithFile(
    prisma.productGroup,
    id,
    "thumbnailId",
    { role: ROLE.ADMIN },
    "Nhóm sản phẩm",
  );
};

export const updateProductGroupStatusService = async (id, data) => {
  id = Number(id);

  const productGroup = await prisma.productGroup.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
    },
  });

  if (!productGroup) {
    throw new NotFoundError("Nhóm sản phẩm");
  }

  return await prisma.productGroup.update({
    where: { id },
    data: {
      isActive: data.isActive,
    },
    include: {
      brand: true,
      category: true,
    },
  });
};
