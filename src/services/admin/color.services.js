import prisma from "../../config/client.js";

import { getAll, getById } from "../../services/common/base.services.js";

import { NotFoundError, ConflictError } from "../../utils/AppError.js";

import {
  adminColorTableSelect,
  adminColorDetailSelect,
} from "../../select/color.select.js";

export const getColorsServices = (query) => {
  return getAll(prisma.color, query, {
    orderBy: { id: "desc" },
    select: adminColorTableSelect,
  });
};

export const getColorByIdServices = (id) => {
  return getById(
    prisma.color,
    id,
    { select: adminColorDetailSelect },
    "màu sắc",
  );
};

export const createColorServices = async (data) => {
  const existed = await prisma.color.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existed) {
    throw new ConflictError("Tên màu đã tồn tại");
  }

  return prisma.color.create({
    data: {
      name: data.name,
      code: data.code,
    },

    select: adminColorTableSelect,
  });
};

export const updateColorServices = async (id, data) => {
  id = Number(id);

  const color = await prisma.color.findUnique({
    where: { id },
  });

  if (!color) {
    throw new NotFoundError("Màu sắc");
  }

  if (data.name && data.name !== color.name) {
    const existed = await prisma.color.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existed) {
      throw new ConflictError("Tên màu đã tồn tại");
    }
  }

  return prisma.color.update({
    where: { id },

    data: {
      name: data.name ?? color.name,
      code: data.code ?? color.code,
    },

    select: adminColorTableSelect,
  });
};

export const deleteColorServices = async (id) => {
  id = Number(id);

  const productColorCount = await prisma.productColor.count({
    where: {
      colorId: id,
    },
  });

  if (productColorCount > 0) {
    throw new ConflictError(
      `Không thể xoá — màu sắc đang được dùng trong ${productColorCount} sản phẩm`,
    );
  }

  const color = await prisma.color.findUnique({
    where: { id },
  });

  if (!color) {
    throw new NotFoundError("Màu sắc");
  }

  await prisma.color.delete({
    where: { id },
  });

  return true;
};
