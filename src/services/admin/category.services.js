import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import { generateSlug } from "../../utils/slug.js";
import { NotFoundError, ConflictError } from "../../utils/AppError.js";

export const getCategoriesServices = async ({ page = 1, limit = 10 }) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: l,
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: { select: { products: true } },
      },
    }),
    prisma.category.count(),
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

export const getCategoryByIdServices = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      _count: { select: { products: true } },
    },
  });

  if (!category) throw new NotFoundError("Danh mục");
  return category;
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
    data: { name: data.name, slug },
    select: { id: true, name: true, slug: true, createdAt: true },
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

  const baseSlug = generateSlug(data.name);
  const slugConflict = await prisma.category.findFirst({
    where: { slug: baseSlug, NOT: { id } },
  });
  const slug = slugConflict ? `${baseSlug}-${Date.now()}` : baseSlug;

  return prisma.category.update({
    where: { id },
    data: { name: data.name, slug },
    select: { id: true, name: true, slug: true, createdAt: true },
  });
};

export const deleteCategoryServices = async (id) => {
  id = Number(id);

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new NotFoundError("Danh mục");

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productCount > 0) {
    throw new ConflictError(
      `Không thể xóa — danh mục đang chứa ${productCount} sản phẩm`,
    );
  }

  await prisma.category.delete({ where: { id } });
  return true;
};
