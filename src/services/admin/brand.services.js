import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import { generateSlug } from "../../utils/slug.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";
import { adminBrandSelect } from "../../select/brand.select.js";

export const getBrandsServices = async ({ page = 1, limit = 10 }) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const [items, total] = await Promise.all([
    prisma.brand.findMany({
      skip,
      take: l,
      orderBy: { id: "desc" },
      select: adminBrandSelect,
    }),
    prisma.brand.count(),
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

export const getBrandByIdServices = async (id) => {
  const brand = await prisma.brand.findUnique({
    where: { id: Number(id) },
    select: adminBrandSelect,
  });

  if (!brand) throw new NotFoundError("Thương hiệu");
  return brand;
};

export const createBrandServices = async (data) => {
  const existed = await prisma.brand.findUnique({ where: { name: data.name } });
  if (existed) throw new ConflictError("Tên thương hiệu đã tồn tại");

  const baseSlug = generateSlug(data.name);
  const slugConflict = await prisma.brand.findUnique({
    where: { slug: baseSlug },
  });
  const slug = slugConflict ? `${baseSlug}-${Date.now()}` : baseSlug;

  return prisma.brand.create({
    data: { name: data.name, slug, logo: data.logo ?? null },
    select: { id: true, name: true, slug: true, logo: true, createdAt: true },
  });
};

export const updateBrandServices = async (id, data, logo) => {
  id = Number(id);

  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) throw new NotFoundError("Thương hiệu");

  const updateData = {};

  if (data.name !== undefined) {
    if (data.name !== brand.name) {
      const duplicated = await prisma.brand.findUnique({
        where: { name: data.name },
      });
      if (duplicated) throw new ConflictError("Tên thương hiệu đã tồn tại");
    }
    const baseSlug = generateSlug(data.name);
    const slugConflict = await prisma.brand.findFirst({
      where: { slug: baseSlug, NOT: { id } },
    });
    updateData.name = data.name;
    updateData.slug = slugConflict ? `${baseSlug}-${Date.now()}` : baseSlug;
  }

  if (logo !== undefined) updateData.logo = logo;

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError("Cần ít nhất một trường để cập nhật");
  }

  return prisma.brand.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, slug: true, logo: true, createdAt: true },
  });
};

export const deleteBrandServices = async (id) => {
  id = Number(id);

  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) throw new NotFoundError("Thương hiệu");

  const productCount = await prisma.product.count({ where: { brandId: id } });
  if (productCount > 0) {
    throw new ConflictError(
      `Không thể xóa — thương hiệu đang có ${productCount} sản phẩm`,
    );
  }

  await prisma.brand.delete({ where: { id } });
  return true;
};
