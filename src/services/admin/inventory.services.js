import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import { NotFoundError, ValidationError } from "../../utils/AppError.js";
import {
  adminInventoryLogSelect,
  adminInventoryLogSelectShort,
} from "../../select/inventory.select.js";
export const getInventoryLogsServices = async ({
  page = 1,
  limit = 10,
  variantId,
  action,
  startDate,
  endDate,
}) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const where = {};
  if (variantId) where.variantId = Number(variantId);
  if (action) where.action = action;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }
  const [items, total] = await Promise.all([
    prisma.inventoryLog.findMany({
      where,
      skip,
      take: l,
      orderBy: { id: "desc" },
      select: adminInventoryLogSelect,
    }),
    prisma.inventoryLog.count({ where }),
  ]);

  return {
    items,
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  };
};

export const getInventoryLogByIdServices = async (id) => {
  const log = await prisma.inventoryLog.findUnique({
    where: { id: Number(id) },
    select: adminInventoryLogSelect,
  });

  if (!log) throw new NotFoundError("Phiếu kho");
  return log;
};

export const getInventorySummaryServices = async ({ page = 1, limit = 10 }) => {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });

  const [items, total] = await Promise.all([
    prisma.variant.findMany({
      where: { isActive: true },
      skip,
      take: l,
      orderBy: { id: "desc" },
      select: {
        id: true,
        sku: true,
        color: true,
        quantity: true,
        sold: true,
        price: true,
        product: { select: { id: true, name: true, thumbnail: true } },
        _count: { select: { inventoryLogs: true } },
      },
    }),
    prisma.variant.count({ where: { isActive: true } }),
  ]);

  return {
    items,
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  };
};

export const createInventoryLogServices = async ({
  variantId,
  action,
  quantity,
  note,
}) => {
  const variant = await prisma.variant.findUnique({
    where: { id: Number(variantId) },
    select: { id: true, quantity: true, sku: true },
  });
  if (!variant) throw new NotFoundError("Variant");

  const quantityBefore = variant.quantity;
  let quantityAfter;

  switch (action) {
    case "IMPORT":
      quantityAfter = quantityBefore + quantity;
      break;
    case "EXPORT":
      if (quantityBefore < quantity) {
        throw new ValidationError(
          `Không đủ hàng — tồn kho hiện tại: ${quantityBefore}, cần xuất: ${quantity}`,
        );
      }
      quantityAfter = quantityBefore - quantity;
      break;
    case "ADJUST":
      quantityAfter = quantity;
      break;
    default:
      throw new ValidationError("Hành động không hợp lệ");
  }

  const [log] = await prisma.$transaction([
    prisma.inventoryLog.create({
      data: {
        variantId: variant.id,
        action,
        quantity,
        quantityBefore,
        quantityAfter,
        note: note ?? null,
      },
      select: adminInventoryLogSelectShort,
    }),
    prisma.variant.update({
      where: { id: variant.id },
      data: { quantity: quantityAfter },
    }),
  ]);

  return log;
};
