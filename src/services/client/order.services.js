import prisma from "../../config/client.js";
import { parsePagination } from "../../utils/pagination.js";
import { orderSelect } from "../../constants/order.select.js";
import { buildPagination } from "../../utils/pagination.js";
import { validateVoucher } from "../../utils/voucher.js";

// ========================
// CREATE ORDER
// ========================
export const createOrderService = async (userId, body) => {
  const {
    receiverName,
    receiverPhone,
    receiverAddress,
    paymentMethod,
    voucherCode,
    note,
    items: bodyItems,
  } = body;

  let orderItems = [];

  // Mua ngay hoặc từ cart
  if (bodyItems && bodyItems.length > 0) {
    orderItems = bodyItems;
  } else {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: { include: { variant: true } },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new Error("Giỏ hàng trống");
    }

    orderItems = cart.cartItems.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));
  }

  // validate variants
  const variantIds = orderItems.map((i) => i.variantId);
  const variants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  if (variants.length !== variantIds.length) {
    throw new Error("Có sản phẩm không tồn tại");
  }

  for (const item of orderItems) {
    const variant = variants.find((v) => v.id === item.variantId);

    if (!variant.isActive || !variant.product.isActive) {
      throw new Error(`Sản phẩm ${variant.product.name} đã ngừng kinh doanh`);
    }

    if (variant.quantity < item.quantity) {
      throw new Error(
        `Sản phẩm ${variant.product.name} chỉ còn ${variant.quantity} trong kho`,
      );
    }
  }

  // subtotal
  const subtotal = orderItems.reduce((sum, item) => {
    const variant = variants.find((v) => v.id === item.variantId);
    return sum + variant.price * item.quantity;
  }, 0);

  // voucher
  let voucherId = null;
  let discountAmount = 0;

  if (voucherCode) {
    const result = await validateVoucher(voucherCode, userId, subtotal);
    voucherId = result.voucher.id;
    discountAmount = result.discountAmount;
  }

  const shippingFee = subtotal - discountAmount >= 500000 ? 0 : 30000;
  const finalPrice = subtotal - discountAmount + shippingFee;

  const order = await prisma.$transaction(async (tx) => {
    // create order
    const newOrder = await tx.order.create({
      data: {
        userId,
        subtotal,
        discountAmount,
        shippingFee,
        finalPrice,
        receiverName,
        receiverPhone,
        receiverAddress,
        note,
        paymentMethod,
        paymentStatus: "PENDING",
        voucherId,
        orderItems: {
          create: orderItems.map((item) => {
            const variant = variants.find((v) => v.id === item.variantId);

            return {
              productName: variant.product.name,
              thumbnail: variant.product.thumbnail,
              variantColor: variant.color,
              variantStorage: variant.product.storage,
              variantSku: variant.sku,
              quantity: item.quantity,
              price: variant.price,
              variantId: variant.id,
            };
          }),
        },
      },
      select: orderSelect,
    });

    // payment
    await tx.payment.create({
      data: {
        orderId: newOrder.id,
        amount: finalPrice,
        provider: paymentMethod,
        status: "PENDING",
      },
    });

    // update stock
    for (const item of orderItems) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: {
          quantity: { decrement: item.quantity },
          sold: { increment: item.quantity },
        },
      });

      const variant = variants.find((v) => v.id === item.variantId);

      await tx.inventoryLog.create({
        data: {
          variantId: item.variantId,
          action: "EXPORT",
          quantity: item.quantity,
          quantityBefore: variant.quantity,
          quantityAfter: variant.quantity - item.quantity,
          note: `Xuất kho cho đơn hàng #${newOrder.id}`,
        },
      });
    }

    // voucher usage
    if (voucherId) {
      await tx.voucher.update({
        where: { id: voucherId },
        data: { usedCount: { increment: 1 } },
      });

      await tx.voucherUsage.create({
        data: { userId, voucherId, orderId: newOrder.id },
      });
    }

    // clear cart
    if (!bodyItems || bodyItems.length === 0) {
      const cart = await tx.cart.findUnique({ where: { userId } });

      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    // notification
    await tx.notification.create({
      data: {
        userId,
        type: "ORDER",
        title: "Đặt hàng thành công",
        content: `Đơn hàng #${newOrder.id} đã được đặt thành công. Tổng tiền: ${finalPrice.toLocaleString()}đ`,
        link: `/orders/${newOrder.id}`,
      },
    });

    return newOrder;
  });

  return prisma.order.findUnique({
    where: { id: order.id },
    select: orderSelect,
  });
};

// ========================
// GET ORDERS
// ========================
export const getOrdersService = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const { status } = query;

  const where = {
    userId,
    ...(status && { status }),
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      select: orderSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { items, pagination: buildPagination(total, page, limit) };
};

// ========================
// GET ORDER BY ID
// ========================
export const getOrderByIdService = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(orderId), userId },
    select: orderSelect,
  });

  if (!order) throw new Error("Đơn hàng không tồn tại");

  return order;
};

// ========================
// CANCEL ORDER
// ========================
export const cancelOrderService = async (userId, orderId, cancelReason) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(orderId), userId },
    include: { orderItems: true },
  });

  if (!order) throw new Error("Đơn hàng không tồn tại");

  if (!["PENDING", "CONFIRMED"].includes(order.status)) {
    throw new Error(
      "Chỉ có thể huỷ đơn hàng ở trạng thái chờ xác nhận hoặc đã xác nhận",
    );
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED", cancelReason },
      select: orderSelect,
    });

    // restore stock
    for (const item of order.orderItems) {
      const variant = await tx.variant.findUnique({
        where: { id: item.variantId },
        select: { quantity: true },
      });

      await tx.variant.update({
        where: { id: item.variantId },
        data: {
          quantity: { increment: item.quantity },
          sold: { decrement: item.quantity },
        },
      });

      await tx.inventoryLog.create({
        data: {
          variantId: item.variantId,
          action: "ADJUST",
          quantity: item.quantity,
          quantityBefore: variant.quantity,
          quantityAfter: variant.quantity + item.quantity,
          note: `Hoàn kho do huỷ đơn hàng #${order.id}`,
        },
      });
    }

    // restore voucher
    if (order.voucherId) {
      await tx.voucher.update({
        where: { id: order.voucherId },
        data: { usedCount: { decrement: 1 } },
      });
    }

    // notification
    await tx.notification.create({
      data: {
        userId,
        type: "ORDER",
        title: "Đơn hàng đã bị huỷ",
        content: `Đơn hàng #${order.id} đã bị huỷ. Lý do: ${cancelReason}`,
        link: `/orders/${order.id}`,
      },
    });

    return updated;
  });

  return updatedOrder;
};
