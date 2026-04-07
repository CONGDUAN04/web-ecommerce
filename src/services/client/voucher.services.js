import prisma from "../../config/client.js";

export const validateVoucher = async (code, userId, subtotal) => {
  const voucher = await prisma.voucher.findUnique({
    where: { code },
    include: { voucherUsages: { where: { userId } } },
  });

  if (!voucher || !voucher.isActive) {
    throw new Error("Mã giảm giá không tồn tại hoặc đã hết hiệu lực");
  }

  const now = new Date();

  if (now < voucher.startDate || now > voucher.endDate) {
    throw new Error("Mã giảm giá chưa đến hoặc đã hết hạn");
  }

  if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
    throw new Error("Mã giảm giá đã hết lượt sử dụng");
  }

  if (
    voucher.usagePerUser &&
    voucher.voucherUsages.length >= voucher.usagePerUser
  ) {
    throw new Error("Bạn đã dùng hết lượt sử dụng mã này");
  }

  if (voucher.minOrderValue && subtotal < voucher.minOrderValue) {
    throw new Error(
      `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString()}đ`,
    );
  }

  let discountAmount = 0;

  if (voucher.type === "PERCENT") {
    discountAmount = Math.floor((subtotal * voucher.discount) / 100);

    if (voucher.maxDiscount) {
      discountAmount = Math.min(discountAmount, voucher.maxDiscount);
    }
  } else {
    discountAmount = voucher.discount;
  }

  return { voucher, discountAmount };
};
