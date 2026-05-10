import prisma from "../../config/client.js";

import { NotFoundError, ConflictError } from "../../utils/AppError.js";
import { parsePagination } from "../../utils/pagination.js";

import {
  adminVariantTableSelect,
  adminVariantDetailSelect,
} from "../../select/variant.select.js";

import { getById, getAll } from "../../services/common/base.services.js";

export const getVariantsServices = (query) => {
  const where = {};

  if (query.productId) {
    where.productId = Number(query.productId);
  }

  if (query.storage) {
    where.storage = query.storage;
  }

  if (query.colorId) {
    where.productColor = {
      colorId: Number(query.colorId),
    };
  }

  return getAll(prisma.variant, query, {
    where,

    orderBy: [{ productId: "asc" }, { createdAt: "desc" }],

    select: adminVariantTableSelect,
  });
};

export const getVariantByIdServices = (id) => {
  return getById(
    prisma.variant,
    id,
    {
      select: adminVariantDetailSelect,
    },
    "Variant",
  );
};

export const getVariantsByProductIdServices = async (productId) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new NotFoundError("Sản phẩm");
  }

  return prisma.variant.findMany({
    where: {
      productId: Number(productId),
      isActive: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: adminVariantTableSelect,
  });
};

export const createVariantServices = async (data) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(data.productId),
    },
  });

  if (!product) {
    throw new NotFoundError("Sản phẩm");
  }

  const productColor = await prisma.productColor.findUnique({
    where: {
      id: Number(data.productColorId),
    },
  });

  if (!productColor) {
    throw new NotFoundError("Màu sản phẩm");
  }

  const skuExist = await prisma.variant.findUnique({
    where: {
      sku: data.sku,
    },
  });

  if (skuExist) {
    throw new ConflictError("SKU đã tồn tại");
  }

  const normalizedStorage = data.storage !== undefined ? data.storage : null;

  const duplicate = await prisma.variant.findFirst({
    where: {
      productId: Number(data.productId),

      productColorId: Number(data.productColorId),

      storage: normalizedStorage,
    },
  });

  if (duplicate) {
    throw new ConflictError("Variant đã tồn tại");
  }

  return prisma.variant.create({
    data: {
      productId: Number(data.productId),

      productColorId: Number(data.productColorId),

      sku: data.sku,

      storage: normalizedStorage,

      price: data.price,

      comparePrice: data.comparePrice ?? null,

      quantity: data.quantity ?? 0,
    },
  });
};

export const updateVariantServices = async (id, data) => {
  id = Number(id);

  const variant = await prisma.variant.findUnique({
    where: {
      id,
    },
  });

  if (!variant) {
    throw new NotFoundError("Variant");
  }

  if (data.sku && data.sku !== variant.sku) {
    const skuExist = await prisma.variant.findUnique({
      where: {
        sku: data.sku,
      },
    });

    if (skuExist) {
      throw new ConflictError("SKU đã tồn tại");
    }
  }

  if (data.productColorId) {
    const productColor = await prisma.productColor.findUnique({
      where: {
        id: Number(data.productColorId),
      },
    });

    if (!productColor) {
      throw new NotFoundError("Màu sản phẩm");
    }
  }

  const normalizedStorage =
    data.storage !== undefined ? data.storage : variant.storage;

  const duplicate = await prisma.variant.findFirst({
    where: {
      productId: variant.productId,

      productColorId: data.productColorId ?? variant.productColorId,

      storage: normalizedStorage,

      NOT: {
        id,
      },
    },
  });

  if (duplicate) {
    throw new ConflictError("Variant đã tồn tại");
  }

  return prisma.variant.update({
    where: {
      id,
    },

    data: {
      sku: data.sku ?? variant.sku,

      storage: normalizedStorage,

      productColorId: data.productColorId ?? variant.productColorId,

      price: data.price ?? variant.price,

      comparePrice:
        data.comparePrice !== undefined
          ? data.comparePrice
          : variant.comparePrice,

      quantity: data.quantity ?? variant.quantity,

      isActive: data.isActive !== undefined ? data.isActive : variant.isActive,
    },
  });
};
export const deleteVariantServices = async (id) => {
  id = Number(id);

  const orderItemCount = await prisma.orderItem.count({
    where: {
      variantId: id,
    },
  });

  if (orderItemCount > 0) {
    throw new ConflictError(
      `Không thể xoá — variant đang tồn tại trong ${orderItemCount} đơn hàng`,
    );
  }

  await prisma.variant.delete({
    where: {
      id,
    },
  });

  return true;
};

export const updateVariantStatusService = async (id, data) => {
  id = Number(id);

  const variant = await prisma.variant.findUnique({
    where: {
      id,
    },
  });

  if (!variant) {
    throw new NotFoundError("Variant");
  }

  return prisma.variant.update({
    where: {
      id,
    },

    data: {
      isActive: data.isActive,
    },
  });
};
