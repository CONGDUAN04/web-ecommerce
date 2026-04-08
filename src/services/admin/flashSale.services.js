import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../utils/AppError.js";
import {
  adminFlashSaleSelect,
  adminFlashSaleDetailSelect,
} from "../../select/flashSale.select.js";

export const getFlashSalesServices = async ({ page = 1, limit = 10 }) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const [items, total] = await Promise.all([
    prisma.flashSale.findMany({
      skip,
      take: l,
      orderBy: { id: "desc" },
      select: adminFlashSaleSelect,
    }),
    prisma.flashSale.count(),
  ]);

  return {
    items,
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  };
};

export const getFlashSaleByIdServices = async (id) => {
  const flashSale = await prisma.flashSale.findUnique({
    where: { id: Number(id) },
    select: adminFlashSaleDetailSelect,
  });

  if (!flashSale) throw new NotFoundError("Flash sale");
  return flashSale;
};

export const createFlashSaleServices = async ({
  name,
  startTime,
  endTime,
  isActive,
  items,
}) => {
  const variantIds = items.map((i) => i.variantId);

  const existingVariants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    select: { id: true, price: true },
  });

  if (existingVariants.length !== variantIds.length) {
    const foundIds = existingVariants.map((v) => v.id);
    const missingIds = variantIds.filter((id) => !foundIds.includes(id));
    throw new NotFoundError(`Variant không tồn tại: ${missingIds.join(", ")}`);
  }

  const priceMap = Object.fromEntries(
    existingVariants.map((v) => [v.id, v.price]),
  );

  for (const item of items) {
    const originalPrice = priceMap[item.variantId];

    if (item.salePrice < originalPrice * 0.2) {
      throw new ValidationError("Không được giảm quá 80%");
    }

    if (item.salePrice >= originalPrice) {
      throw new ValidationError(
        `Giá flash sale của variant ${item.variantId} phải nhỏ hơn giá gốc (${originalPrice}đ)`,
      );
    }
  }

  return prisma.flashSale.create({
    data: {
      name,
      startTime,
      endTime,
      isActive,
      items: {
        create: items.map((item) => ({
          variantId: item.variantId,
          salePrice: item.salePrice,
          quantity: item.quantity,
        })),
      },
    },
    select: adminFlashSaleDetailSelect,
  });
};

export const updateFlashSaleServices = async (id, data) => {
  id = Number(id);

  const flashSale = await prisma.flashSale.findUnique({ where: { id } });
  if (!flashSale) throw new NotFoundError("Flash sale");

  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const resolvedStart = data.startTime ?? flashSale.startTime;
  const resolvedEnd = data.endTime ?? flashSale.endTime;

  if (data.startTime !== undefined || data.endTime !== undefined) {
    if (resolvedEnd <= resolvedStart) {
      throw new ValidationError(
        "Thời gian kết thúc phải sau thời gian bắt đầu",
      );
    }

    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError("Cần ít nhất một trường để cập nhật");
  }

  return prisma.flashSale.update({
    where: { id },
    data: updateData,
    select: adminFlashSaleDetailSelect,
  });
};

export const deleteFlashSaleServices = async (id) => {
  id = Number(id);

  const flashSale = await prisma.flashSale.findUnique({ where: { id } });
  if (!flashSale) throw new NotFoundError("Flash sale");

  await prisma.flashSale.delete({ where: { id } });
  return true;
};

export const addFlashSaleItemsServices = async (id, items) => {
  id = Number(id);

  const flashSale = await prisma.flashSale.findUnique({
    where: { id },
    include: { items: { select: { variantId: true } } },
  });

  if (!flashSale) throw new NotFoundError("Flash sale");

  const existingVariantIds = flashSale.items.map((i) => i.variantId);
  const conflictIds = items
    .map((i) => i.variantId)
    .filter((vid) => existingVariantIds.includes(vid));

  if (conflictIds.length > 0) {
    throw new ConflictError(
      `Variant đã tồn tại trong flash sale: ${conflictIds.join(", ")}`,
    );
  }

  const variantIds = items.map((i) => i.variantId);

  const existingVariants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    select: { id: true, price: true },
  });

  if (existingVariants.length !== variantIds.length) {
    const foundIds = existingVariants.map((v) => v.id);
    const missingIds = variantIds.filter((id) => !foundIds.includes(id));
    throw new NotFoundError(`Variant không tồn tại: ${missingIds.join(", ")}`);
  }

  const priceMap = Object.fromEntries(
    existingVariants.map((v) => [v.id, v.price]),
  );

  for (const item of items) {
    const originalPrice = priceMap[item.variantId];

    if (item.salePrice < originalPrice * 0.2) {
      throw new ValidationError("Không được giảm quá 80%");
    }

    if (item.salePrice >= originalPrice) {
      throw new ValidationError(
        `Giá flash sale của variant ${item.variantId} phải nhỏ hơn giá gốc (${originalPrice}đ)`,
      );
    }
  }

  await prisma.flashSaleItem.createMany({
    data: items.map((item) => ({
      flashSaleId: id,
      variantId: item.variantId,
      salePrice: item.salePrice,
      quantity: item.quantity,
    })),
  });

  return prisma.flashSale.findUnique({
    where: { id },
    select: adminFlashSaleDetailSelect,
  });
};

export const updateFlashSaleItemServices = async (id, itemId, data) => {
  id = Number(id);
  itemId = Number(itemId);

  const item = await prisma.flashSaleItem.findFirst({
    where: { id: itemId, flashSaleId: id },
    include: { variant: { select: { price: true } } },
  });

  if (!item) throw new NotFoundError("Flash sale item");

  if (Object.keys(data).length === 0) {
    throw new ValidationError("Cần ít nhất một trường để cập nhật");
  }

  const originalPrice = item.variant.price;
  const newSalePrice = data.salePrice ?? item.salePrice;

  if (newSalePrice < originalPrice * 0.2) {
    throw new ValidationError("Không được giảm quá 80%");
  }

  if (newSalePrice >= originalPrice) {
    throw new ValidationError(
      `Giá flash sale phải nhỏ hơn giá gốc (${originalPrice}đ)`,
    );
  }

  return prisma.flashSaleItem.update({
    where: { id: itemId },
    data,
    select: {
      id: true,
      salePrice: true,
      quantity: true,
      sold: true,
      variant: {
        select: {
          id: true,
          sku: true,
          color: true,
          price: true,
          product: { select: { id: true, name: true, thumbnail: true } },
        },
      },
    },
  });
};

export const deleteFlashSaleItemServices = async (id, itemId) => {
  id = Number(id);
  itemId = Number(itemId);

  const item = await prisma.flashSaleItem.findFirst({
    where: { id: itemId, flashSaleId: id },
  });

  if (!item) throw new NotFoundError("Flash sale item");

  if (item.sold > 0) {
    throw new ConflictError(
      `Không thể xóa — sản phẩm đã bán được ${item.sold} trong flash sale này`,
    );
  }

  await prisma.flashSaleItem.delete({ where: { id: itemId } });
  return true;
};
