import prisma from "../../config/client.js";
import { generateSlug } from "../../utils/slug.js";
import { NotFoundError, ConflictError } from "../../utils/AppError.js";
import { adminBrandSelect } from "../../select/brand.select.js";
import {
  getAll,
  getById,
  deleteWithFile,
} from "../../services/common/base.services.js";
import { cleanupOldFile } from "../common/file.helper.js";
import { ROLE } from "../../constants/index.js";

export const getBrandsServices = (query) => {
  return getAll(prisma.brand, query, {
    orderBy: { id: "desc" },
    select: adminBrandSelect,
  });
};

export const getBrandByIdServices = (id) => {
  return getById(prisma.brand, id, { select: adminBrandSelect }, "thương hiệu");
};

export const createBrandServices = async (data) => {
  const existed = await prisma.brand.findUnique({
    where: { name: data.name },
  });

  if (existed) throw new ConflictError("Tên thương hiệu đã tồn tại");

  const slug = generateSlug(data.name);

  return prisma.brand.create({
    data: {
      name: data.name,
      slug,
      logo: data.logo || null,
      logoId: data.logoId || null,
    },
  });
};

export const updateBrandServices = async (id, data) => {
  id = Number(id);

  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) throw new NotFoundError("Thương hiệu");

  if (data.name && data.name !== brand.name) {
    const existed = await prisma.brand.findUnique({
      where: { name: data.name },
    });
    if (existed) throw new ConflictError("Tên thương hiệu đã tồn tại");
  }
  const updated = await prisma.brand.update({
    where: { id },
    data: {
      name: data.name ?? brand.name,
      slug: data.name ? generateSlug(data.name) : brand.slug,
      logo: data.logo ?? brand.logo,
      logoId: data.logoId ?? brand.logoId,
    },
  });
  cleanupOldFile(brand.logoId, data.logoId, { role: ROLE.ADMIN }, "logo");
  return updated;
};

export const deleteBrandServices = async (id) => {
  id = Number(id);

  const productCount = await prisma.product.count({
    where: { brandId: id },
  });

  if (productCount > 0) {
    throw new ConflictError(
      `Không thể xoá — thương hiệu đang chứa ${productCount} sản phẩm`,
    );
  }

  const groupCount = await prisma.productGroup.count({
    where: { brandId: id },
  });

  if (groupCount > 0) {
    throw new ConflictError(
      `Không thể xoá — thương hiệu đang chứa ${groupCount} nhóm sản phẩm`,
    );
  }
  return deleteWithFile(
    prisma.brand,
    id,
    "logoId",
    { role: "ADMIN" },
    "thương hiệu",
  );
};
