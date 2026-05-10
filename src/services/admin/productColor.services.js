import prisma from "../../config/client.js";

import {
  getAll,
  getById,
  deleteWithFile,
} from "../../services/common/base.services.js";

import { NotFoundError, ConflictError } from "../../utils/AppError.js";

import {
  adminProductColorDetailSelect,
  adminProductColorTableSelect,
} from "../../select/productColor.select.js";

import { cleanupOldFile } from "../common/file.helper.js";

import { ROLE } from "../../constants/index.js";

export const getProductColorsServices = (query) => {
  return getAll(prisma.productColor, query, {
    where: {
      ...(query.productId && {
        productId: Number(query.productId),
      }),

      ...(query.colorId && {
        colorId: Number(query.colorId),
      }),
    },

    orderBy: {
      id: "desc",
    },

    select: adminProductColorTableSelect,
  });
};

export const getProductColorByIdServices = (id) => {
  return getById(
    prisma.productColor,
    id,
    {
      select: adminProductColorDetailSelect,
    },
    "màu sản phẩm",
  );
};

export const createProductColorServices = async (data) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(data.productId),
    },
  });

  if (!product) {
    throw new NotFoundError("Sản phẩm");
  }

  const color = await prisma.color.findUnique({
    where: {
      id: Number(data.colorId),
    },
  });

  if (!color) {
    throw new NotFoundError("Màu sắc");
  }

  const existed = await prisma.productColor.findFirst({
    where: {
      productId: Number(data.productId),
      colorId: Number(data.colorId),
    },
  });

  if (existed) {
    throw new ConflictError("Màu này đã tồn tại trong sản phẩm");
  }

  return prisma.productColor.create({
    data: {
      productId: Number(data.productId),

      colorId: Number(data.colorId),

      image: data.image || null,

      imageId: data.imageId || null,
    },

    select: adminProductColorTableSelect,
  });
};

export const updateProductColorServices = async (id, data) => {
  id = Number(id);

  const productColor = await prisma.productColor.findUnique({
    where: { id },
  });

  if (!productColor) {
    throw new NotFoundError("Màu sản phẩm");
  }

  if (data.colorId) {
    const color = await prisma.color.findUnique({
      where: {
        id: Number(data.colorId),
      },
    });

    if (!color) {
      throw new NotFoundError("Màu sắc");
    }

    const duplicate = await prisma.productColor.findFirst({
      where: {
        productId: productColor.productId,
        colorId: Number(data.colorId),
        NOT: {
          id,
        },
      },
    });

    if (duplicate) {
      throw new ConflictError("Màu này đã tồn tại trong sản phẩm");
    }
  }
  const updateData = {};

  if (data.colorId !== undefined) {
    updateData.colorId = data.colorId;
  }

  if (data.image !== undefined) {
    updateData.image = data.image;
  }

  if (data.imageId !== undefined) {
    updateData.imageId = data.imageId;
  }

  const updated = await prisma.productColor.update({
    where: { id },
    data: updateData,
    select: adminProductColorTableSelect,
  });

  cleanupOldFile(
    productColor.imageId,
    data.imageId,
    { role: ROLE.ADMIN },
    "productColor",
  );

  return updated;
};

export const deleteProductColorServices = async (id) => {
  id = Number(id);

  const variantCount = await prisma.variant.count({
    where: {
      productColorId: id,
    },
  });

  if (variantCount > 0) {
    throw new ConflictError(
      `Không thể xoá — màu sản phẩm đang chứa ${variantCount} variants`,
    );
  }

  return deleteWithFile(
    prisma.productColor,
    id,
    "imageId",
    { role: ROLE.ADMIN },
    "productColor",
  );
};
