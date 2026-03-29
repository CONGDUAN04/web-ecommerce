import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ========================
  // ROLES
  // ========================
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Quản trị viên" },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER", description: "Khách hàng" },
  });

  // ========================
  // USERS
  // ========================
  const hashedPassword = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin@gmail.com" },
    update: {},
    create: {
      username: "admin@gmail.com",
      password: hashedPassword,
      fullName: "Admin",
      phone: "0900000000",
      roleId: adminRole.id,
    },
  });

  const customer = await prisma.user.upsert({
    where: { username: "user@gmail.com" },
    update: {},
    create: {
      username: "user@gmail.com",
      password: hashedPassword,
      fullName: "Nguyễn Văn A",
      phone: "0911111111",
      roleId: userRole.id,
    },
  });

  // ========================
  // CATEGORY & BRAND
  // ========================
  const category = await prisma.category.upsert({
    where: { slug: "dien-thoai" },
    update: {},
    create: { name: "Điện thoại", slug: "dien-thoai" },
  });

  const brand = await prisma.brand.upsert({
    where: { slug: "apple" },
    update: {},
    create: { name: "Apple", slug: "apple" },
  });

  // ========================
  // PRODUCT GROUP
  // ========================
  const group = await prisma.productGroup.upsert({
    where: { slug: "iphone-16-series" },
    update: {},
    create: {
      name: "iPhone 16 Series",
      slug: "iphone-16-series",
      series: "iPhone 16",
      brandId: brand.id,
      categoryId: category.id,
    },
  });

  // ========================
  // PRODUCT
  // ========================
  const product = await prisma.product.upsert({
    where: { slug: "iphone-16-pro-256gb" },
    update: {},
    create: {
      name: "iPhone 16 Pro 256GB",
      slug: "iphone-16-pro-256gb",
      storage: 256,
      groupId: group.id,
      brandId: brand.id,
      categoryId: category.id,
    },
  });

  // ========================
  // VARIANTS
  // ========================
  const variantBlack = await prisma.variant.upsert({
    where: { sku: "IP16P-256-BLACK" },
    update: {},
    create: {
      sku: "IP16P-256-BLACK",
      color: "Titan Đen",
      price: 29990000,
      comparePrice: 31990000,
      quantity: 50,
      productId: product.id,
    },
  });

  const variantWhite = await prisma.variant.upsert({
    where: { sku: "IP16P-256-WHITE" },
    update: {},
    create: {
      sku: "IP16P-256-WHITE",
      color: "Titan Trắng",
      price: 29990000,
      comparePrice: 31990000,
      quantity: 30,
      productId: product.id,
    },
  });

  // ========================
  // VOUCHER
  // ========================
  const voucher = await prisma.voucher.upsert({
    where: { code: "GIAM10" },
    update: {},
    create: {
      code: "GIAM10",
      type: "PERCENT",
      discount: 10,
      maxDiscount: 500000,
      minOrderValue: 1000000,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 100,
      usagePerUser: 1,
    },
  });

  // ========================
  // ORDER 1 — PENDING (COD)
  // ========================
  const order1 = await prisma.order.create({
    data: {
      subtotal: 29990000,
      discountAmount: 0,
      shippingFee: 30000,
      finalPrice: 30020000,
      receiverName: "Nguyễn Văn A",
      receiverPhone: "0911111111",
      receiverAddress: "123 Lê Lợi, Q1, TP.HCM",
      status: "PENDING",
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      userId: customer.id,
      orderItems: {
        create: {
          productName: "iPhone 16 Pro 256GB",
          thumbnail: null,
          variantColor: "Titan Đen",
          variantStorage: 256,
          variantSku: "IP16P-256-BLACK",
          quantity: 1,
          price: 29990000,
          variantId: variantBlack.id,
        },
      },
      payment: {
        create: {
          amount: 30020000,
          provider: "COD",
          status: "PENDING",
        },
      },
    },
  });

  // ========================
  // ORDER 2 — SHIPPING (VNPAY)
  // ========================
  const order2 = await prisma.order.create({
    data: {
      subtotal: 59980000,
      discountAmount: 500000,
      shippingFee: 0,
      finalPrice: 59480000,
      receiverName: "Nguyễn Văn A",
      receiverPhone: "0911111111",
      receiverAddress: "123 Lê Lợi, Q1, TP.HCM",
      note: "Giao giờ hành chính",
      trackingCode: "VN123456789",
      status: "SHIPPING",
      paymentMethod: "VNPAY",
      paymentStatus: "SUCCESS",
      userId: customer.id,
      voucherId: voucher.id,
      orderItems: {
        create: [
          {
            productName: "iPhone 16 Pro 256GB",
            variantColor: "Titan Đen",
            variantStorage: 256,
            variantSku: "IP16P-256-BLACK",
            quantity: 1,
            price: 29990000,
            variantId: variantBlack.id,
          },
          {
            productName: "iPhone 16 Pro 256GB",
            variantColor: "Titan Trắng",
            variantStorage: 256,
            variantSku: "IP16P-256-WHITE",
            quantity: 1,
            price: 29990000,
            variantId: variantWhite.id,
          },
        ],
      },
      payment: {
        create: {
          amount: 59480000,
          provider: "VNPAY",
          status: "SUCCESS",
          transactionId: "VNPAY_TX_20240101",
        },
      },
      voucherUsages: {
        create: {
          userId: customer.id,
          voucherId: voucher.id,
        },
      },
    },
  });

  // ========================
  // ORDER 3 — COMPLETED
  // ========================
  const order3 = await prisma.order.create({
    data: {
      subtotal: 29990000,
      discountAmount: 0,
      shippingFee: 30000,
      finalPrice: 30020000,
      receiverName: "Nguyễn Văn A",
      receiverPhone: "0911111111",
      receiverAddress: "123 Lê Lợi, Q1, TP.HCM",
      status: "COMPLETED",
      paymentMethod: "MOMO",
      paymentStatus: "SUCCESS",
      userId: customer.id,
      orderItems: {
        create: {
          productName: "iPhone 16 Pro 256GB",
          variantColor: "Titan Trắng",
          variantStorage: 256,
          variantSku: "IP16P-256-WHITE",
          quantity: 1,
          price: 29990000,
          variantId: variantWhite.id,
        },
      },
      payment: {
        create: {
          amount: 30020000,
          provider: "MOMO",
          status: "SUCCESS",
          transactionId: "MOMO_TX_20240102",
        },
      },
    },
  });

  // ========================
  // ORDER 4 — RETURN_REQUESTED
  // ========================
  const order4 = await prisma.order.create({
    data: {
      subtotal: 29990000,
      discountAmount: 0,
      shippingFee: 30000,
      finalPrice: 30020000,
      receiverName: "Nguyễn Văn A",
      receiverPhone: "0911111111",
      receiverAddress: "123 Lê Lợi, Q1, TP.HCM",
      status: "RETURN_REQUESTED",
      paymentMethod: "VNPAY",
      paymentStatus: "SUCCESS",
      userId: customer.id,
      orderItems: {
        create: {
          productName: "iPhone 16 Pro 256GB",
          variantColor: "Titan Đen",
          variantStorage: 256,
          variantSku: "IP16P-256-BLACK",
          quantity: 1,
          price: 29990000,
          variantId: variantBlack.id,
        },
      },
      payment: {
        create: {
          amount: 30020000,
          provider: "VNPAY",
          status: "SUCCESS",
          transactionId: "VNPAY_TX_20240103",
        },
      },
    },
  });
  // Tạo ReturnRequest cho order4
  const orderItem4 = await prisma.orderItem.findFirst({
    where: { orderId: order4.id },
  });

  await prisma.returnRequest.create({
    data: {
      reason: "DEFECTIVE",
      note: "Máy bị lỗi màn hình",
      evidence: JSON.stringify(["https://example.com/evidence1.jpg"]),
      orderId: order4.id,
      userId: customer.id,
      returnItems: {
        create: {
          quantity: 1,
          reason: "Màn hình bị đốm sáng",
          isRestockable: false,
          orderItemId: orderItem4.id,
        },
      },
    },
  });
  const order5 = await prisma.order.create({
    data: {
      subtotal: 29990000,
      discountAmount: 0,
      shippingFee: 30000,
      finalPrice: 30020000,
      receiverName: "Nguyễn Văn A",
      receiverPhone: "0911111111",
      receiverAddress: "123 Lê Lợi, Q1, TP.HCM",
      status: "PENDING",
      paymentMethod: "BANKING",
      paymentStatus: "PENDING",
      userId: customer.id,
      orderItems: {
        create: {
          productName: "iPhone 16 Pro 256GB",
          variantColor: "Titan Đen",
          variantStorage: 256,
          variantSku: "IP16P-256-BLACK",
          quantity: 1,
          price: 29990000,
          variantId: variantBlack.id,
        },
      },
      payment: {
        create: {
          amount: 30020000,
          provider: "BANKING",
          status: "PENDING",
        },
      },
    },
  });
  console.log("✅ Seed thành công!");
  console.log(`   Admin:    admin@gmail.com / 123456`);
  console.log(`   Customer: user@gmail.com  / 123456`);
  console.log(
    `   Orders:   #${order1.id} PENDING | #${order2.id} SHIPPING | #${order3.id} COMPLETED | #${order4.id} RETURN_REQUESTED`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
