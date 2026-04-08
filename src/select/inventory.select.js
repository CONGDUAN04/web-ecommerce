export const adminInventoryLogSelectShort = {
  id: true,
  action: true,
  quantity: true,
  quantityBefore: true,
  quantityAfter: true,
  note: true,
  createdAt: true,
  variant: {
    select: {
      id: true,
      sku: true,
      color: true,
      product: { select: { id: true, name: true } },
    },
  },
};
export const adminInventoryLogSelect = {
  id: true,
  action: true,
  quantity: true,
  quantityBefore: true,
  quantityAfter: true,
  note: true,
  createdAt: true,
  variant: {
    select: {
      id: true,
      sku: true,
      color: true,
      quantity: true,
      product: { select: { id: true, name: true, thumbnail: true } },
    },
  },
};
