// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed data...");

  // ========================
  // ROLES
  // ========================
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Quản trị viên" },
  });

  await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER", description: "Người dùng" },
  });

  console.log("✅ Roles");

  // ========================
  // ADMIN USER
  // ========================
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin@gmail.com" },
    update: {},
    create: {
      username: "admin@gmail.com",
      password: hashedPassword,
      fullName: "Admin",
      roleId: adminRole.id,
    },
  });

  console.log("✅ Admin user");

  // ========================
  // CATEGORIES
  // ========================
  const catPhone = await prisma.category.upsert({
    where: { slug: "dien-thoai" },
    update: {},
    create: { name: "Điện thoại", slug: "dien-thoai" },
  });

  const catAccessory = await prisma.category.upsert({
    where: { slug: "phu-kien" },
    update: {},
    create: { name: "Phụ kiện", slug: "phu-kien" },
  });

  console.log("✅ Categories");

  // ========================
  // BRANDS
  // ========================
  const brandApple = await prisma.brand.upsert({
    where: { slug: "apple" },
    update: {},
    create: { name: "Apple", slug: "apple" },
  });

  const brandSamsung = await prisma.brand.upsert({
    where: { slug: "samsung" },
    update: {},
    create: { name: "Samsung", slug: "samsung" },
  });

  const brandXiaomi = await prisma.brand.upsert({
    where: { slug: "xiaomi" },
    update: {},
    create: { name: "Xiaomi", slug: "xiaomi" },
  });

  console.log("✅ Brands");

  // ========================
  // PRODUCT GROUPS
  // ========================
  const groupIphone16 = await prisma.productGroup.upsert({
    where: { slug: "iphone-16-series" },
    update: {},
    create: {
      name: "iPhone 16 Series",
      slug: "iphone-16-series",
      series: "iPhone 16",
      brandId: brandApple.id,
      categoryId: catPhone.id,
    },
  });

  const groupIphone15 = await prisma.productGroup.upsert({
    where: { slug: "iphone-15-series" },
    update: {},
    create: {
      name: "iPhone 15 Series",
      slug: "iphone-15-series",
      series: "iPhone 15",
      brandId: brandApple.id,
      categoryId: catPhone.id,
    },
  });

  const groupGalaxyS25 = await prisma.productGroup.upsert({
    where: { slug: "galaxy-s25-series" },
    update: {},
    create: {
      name: "Galaxy S25 Series",
      slug: "galaxy-s25-series",
      series: "Galaxy S25",
      brandId: brandSamsung.id,
      categoryId: catPhone.id,
    },
  });

  const groupGalaxyA = await prisma.productGroup.upsert({
    where: { slug: "galaxy-a-series" },
    update: {},
    create: {
      name: "Galaxy A Series",
      slug: "galaxy-a-series",
      series: "Galaxy A",
      brandId: brandSamsung.id,
      categoryId: catPhone.id,
    },
  });

  const groupXiaomi14 = await prisma.productGroup.upsert({
    where: { slug: "xiaomi-14-series" },
    update: {},
    create: {
      name: "Xiaomi 14 Series",
      slug: "xiaomi-14-series",
      series: "Xiaomi 14",
      brandId: brandXiaomi.id,
      categoryId: catPhone.id,
    },
  });

  const groupAccessory = await prisma.productGroup.upsert({
    where: { slug: "phu-kien-chinh-hang" },
    update: {},
    create: {
      name: "Phụ kiện chính hãng",
      slug: "phu-kien-chinh-hang",
      brandId: brandApple.id,
      categoryId: catAccessory.id,
    },
  });

  console.log("✅ Product Groups");

  // ========================
  // PRODUCTS + VARIANTS
  // ========================
  const productsData = [
    // ── APPLE ──────────────────────────────
    {
      name: "iPhone 16 Pro 256GB",
      slug: "iphone-16-pro-256gb",
      storage: 256,
      description:
        "iPhone 16 Pro với chip A18 Pro, camera 48MP, màn hình 6.3 inch.",
      groupId: groupIphone16.id,
      brandId: brandApple.id,
      categoryId: catPhone.id,
      viewCount: 1200,
      variants: [
        {
          sku: "IP16P-256-BLACK",
          color: "Titan Đen",
          price: 29990000,
          comparePrice: 31990000,
          quantity: 50,
          sold: 120,
        },
        {
          sku: "IP16P-256-WHITE",
          color: "Titan Trắng",
          price: 29990000,
          comparePrice: 31990000,
          quantity: 30,
          sold: 80,
        },
        {
          sku: "IP16P-256-DESERT",
          color: "Sa Mạc",
          price: 29990000,
          comparePrice: 31990000,
          quantity: 20,
          sold: 60,
        },
      ],
    },
    {
      name: "iPhone 16 Pro 512GB",
      slug: "iphone-16-pro-512gb",
      storage: 512,
      description:
        "iPhone 16 Pro 512GB bộ nhớ lớn cho người dùng chuyên nghiệp.",
      groupId: groupIphone16.id,
      brandId: brandApple.id,
      categoryId: catPhone.id,
      viewCount: 900,
      variants: [
        {
          sku: "IP16P-512-BLACK",
          color: "Titan Đen",
          price: 34990000,
          comparePrice: 36990000,
          quantity: 25,
          sold: 55,
        },
        {
          sku: "IP16P-512-WHITE",
          color: "Titan Trắng",
          price: 34990000,
          comparePrice: 36990000,
          quantity: 15,
          sold: 40,
        },
      ],
    },
    {
      name: "iPhone 16 256GB",
      slug: "iphone-16-256gb",
      storage: 256,
      description: "iPhone 16 tiêu chuẩn với chip A18, camera nâng cấp.",
      groupId: groupIphone16.id,
      brandId: brandApple.id,
      categoryId: catPhone.id,
      viewCount: 800,
      variants: [
        {
          sku: "IP16-256-BLACK",
          color: "Đen",
          price: 22990000,
          comparePrice: 24990000,
          quantity: 60,
          sold: 200,
        },
        {
          sku: "IP16-256-PINK",
          color: "Hồng",
          price: 22990000,
          comparePrice: 24990000,
          quantity: 40,
          sold: 150,
        },
        {
          sku: "IP16-256-BLUE",
          color: "Xanh",
          price: 22990000,
          comparePrice: 24990000,
          quantity: 35,
          sold: 100,
        },
      ],
    },
    {
      name: "iPhone 15 Pro 256GB",
      slug: "iphone-15-pro-256gb",
      storage: 256,
      description: "iPhone 15 Pro với chip A17 Pro, thiết kế titan cao cấp.",
      groupId: groupIphone15.id,
      brandId: brandApple.id,
      categoryId: catPhone.id,
      viewCount: 500,
      variants: [
        {
          sku: "IP15P-256-BLACK",
          color: "Titan Đen",
          price: 24990000,
          comparePrice: 27990000,
          quantity: 20,
          sold: 300,
        },
        {
          sku: "IP15P-256-NATURAL",
          color: "Titan Tự Nhiên",
          price: 24990000,
          comparePrice: 27990000,
          quantity: 15,
          sold: 250,
        },
      ],
    },
    {
      name: "iPhone 15 128GB",
      slug: "iphone-15-128gb",
      storage: 128,
      description: "iPhone 15 tiêu chuẩn cổng USB-C, camera 48MP.",
      groupId: groupIphone15.id,
      brandId: brandApple.id,
      categoryId: catPhone.id,
      viewCount: 400,
      variants: [
        {
          sku: "IP15-128-BLACK",
          color: "Đen",
          price: 18990000,
          comparePrice: 20990000,
          quantity: 30,
          sold: 400,
        },
        {
          sku: "IP15-128-YELLOW",
          color: "Vàng",
          price: 18990000,
          comparePrice: 20990000,
          quantity: 25,
          sold: 350,
        },
        {
          sku: "IP15-128-GREEN",
          color: "Xanh Lá",
          price: 18990000,
          comparePrice: 20990000,
          quantity: 20,
          sold: 300,
        },
      ],
    },

    // ── SAMSUNG ────────────────────────────
    {
      name: "Samsung Galaxy S25 Ultra 256GB",
      slug: "samsung-galaxy-s25-ultra-256gb",
      storage: 256,
      description:
        "Galaxy S25 Ultra bút S Pen, camera 200MP, chip Snapdragon 8 Elite.",
      groupId: groupGalaxyS25.id,
      brandId: brandSamsung.id,
      categoryId: catPhone.id,
      viewCount: 1100,
      variants: [
        {
          sku: "S25U-256-BLACK",
          color: "Titanium Black",
          price: 31990000,
          comparePrice: 33990000,
          quantity: 40,
          sold: 90,
        },
        {
          sku: "S25U-256-SILVER",
          color: "Titanium Silver",
          price: 31990000,
          comparePrice: 33990000,
          quantity: 30,
          sold: 70,
        },
        {
          sku: "S25U-256-BLUE",
          color: "Titanium Blue",
          price: 31990000,
          comparePrice: 33990000,
          quantity: 20,
          sold: 50,
        },
      ],
    },
    {
      name: "Samsung Galaxy S25 256GB",
      slug: "samsung-galaxy-s25-256gb",
      storage: 256,
      description: "Galaxy S25 tiêu chuẩn mỏng nhẹ, chip Snapdragon 8 Elite.",
      groupId: groupGalaxyS25.id,
      brandId: brandSamsung.id,
      categoryId: catPhone.id,
      viewCount: 750,
      variants: [
        {
          sku: "S25-256-BLACK",
          color: "Đen",
          price: 22990000,
          comparePrice: 24990000,
          quantity: 50,
          sold: 130,
        },
        {
          sku: "S25-256-BLUE",
          color: "Xanh",
          price: 22990000,
          comparePrice: 24990000,
          quantity: 35,
          sold: 100,
        },
      ],
    },
    {
      name: "Samsung Galaxy A56 128GB",
      slug: "samsung-galaxy-a56-128gb",
      storage: 128,
      description: "Galaxy A56 tầm trung cao cấp, màn hình AMOLED 6.7 inch.",
      groupId: groupGalaxyA.id,
      brandId: brandSamsung.id,
      categoryId: catPhone.id,
      viewCount: 600,
      variants: [
        {
          sku: "A56-128-BLACK",
          color: "Đen",
          price: 10990000,
          comparePrice: 12490000,
          quantity: 80,
          sold: 220,
        },
        {
          sku: "A56-128-BLUE",
          color: "Xanh Dương",
          price: 10990000,
          comparePrice: 12490000,
          quantity: 60,
          sold: 180,
        },
        {
          sku: "A56-128-PINK",
          color: "Hồng",
          price: 10990000,
          comparePrice: 12490000,
          quantity: 50,
          sold: 160,
        },
      ],
    },
    {
      name: "Samsung Galaxy A36 128GB",
      slug: "samsung-galaxy-a36-128gb",
      storage: 128,
      description: "Galaxy A36 pin 5000mAh, sạc nhanh 45W.",
      groupId: groupGalaxyA.id,
      brandId: brandSamsung.id,
      categoryId: catPhone.id,
      viewCount: 400,
      variants: [
        {
          sku: "A36-128-BLACK",
          color: "Đen",
          price: 8490000,
          comparePrice: 9490000,
          quantity: 100,
          sold: 280,
        },
        {
          sku: "A36-128-WHITE",
          color: "Trắng",
          price: 8490000,
          comparePrice: 9490000,
          quantity: 80,
          sold: 250,
        },
      ],
    },

    // ── XIAOMI ─────────────────────────────
    {
      name: "Xiaomi 14 Ultra 512GB",
      slug: "xiaomi-14-ultra-512gb",
      storage: 512,
      description: "Xiaomi 14 Ultra camera Leica, Snapdragon 8 Gen 3, sạc 90W.",
      groupId: groupXiaomi14.id,
      brandId: brandXiaomi.id,
      categoryId: catPhone.id,
      viewCount: 950,
      variants: [
        {
          sku: "X14U-512-BLACK",
          color: "Đen",
          price: 26990000,
          comparePrice: 28990000,
          quantity: 30,
          sold: 75,
        },
        {
          sku: "X14U-512-WHITE",
          color: "Trắng",
          price: 26990000,
          comparePrice: 28990000,
          quantity: 20,
          sold: 50,
        },
      ],
    },
    {
      name: "Xiaomi 14 256GB",
      slug: "xiaomi-14-256gb",
      storage: 256,
      description:
        "Xiaomi 14 tiêu chuẩn Snapdragon 8 Gen 3, màn hình LTPO AMOLED.",
      groupId: groupXiaomi14.id,
      brandId: brandXiaomi.id,
      categoryId: catPhone.id,
      viewCount: 700,
      variants: [
        {
          sku: "X14-256-BLACK",
          color: "Đen",
          price: 18990000,
          comparePrice: 20990000,
          quantity: 45,
          sold: 110,
        },
        {
          sku: "X14-256-GREEN",
          color: "Xanh Ngọc",
          price: 18990000,
          comparePrice: 20990000,
          quantity: 30,
          sold: 80,
        },
      ],
    },

    // ── PHỤ KIỆN ───────────────────────────
    {
      name: "AirPods Pro 2",
      slug: "airpods-pro-2",
      storage: null,
      description:
        "AirPods Pro thế hệ 2 chống ồn chủ động, âm thanh không gian.",
      groupId: groupAccessory.id,
      brandId: brandApple.id,
      categoryId: catAccessory.id,
      viewCount: 850,
      variants: [
        {
          sku: "APP2-WHITE",
          color: "Trắng",
          price: 6490000,
          comparePrice: 7490000,
          quantity: 100,
          sold: 350,
        },
      ],
    },
    {
      name: "Cáp USB-C Apple 1m",
      slug: "cap-usb-c-apple-1m",
      storage: null,
      description:
        "Cáp USB-C chính hãng Apple hỗ trợ sạc nhanh và truyền dữ liệu.",
      groupId: groupAccessory.id,
      brandId: brandApple.id,
      categoryId: catAccessory.id,
      viewCount: 300,
      variants: [
        {
          sku: "CABLE-USBC-1M",
          color: "Trắng",
          price: 490000,
          comparePrice: 590000,
          quantity: 200,
          sold: 500,
        },
      ],
    },
  ];

  for (const p of productsData) {
    const { variants, ...productData } = p;

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });

    for (const v of variants) {
      await prisma.variant.upsert({
        where: { sku: v.sku },
        update: {},
        create: { ...v, productId: product.id },
      });
    }
  }

  console.log("✅ Products & Variants");

  // ========================
  // SPECIFICATIONS
  // ========================
  const specs = {
    "iphone-16-pro-256gb": [
      { name: "Màn hình", value: "6.3 inch Super Retina XDR OLED" },
      { name: "Chip", value: "Apple A18 Pro" },
      { name: "RAM", value: "8GB" },
      { name: "Camera sau", value: "48MP + 48MP + 12MP" },
      { name: "Pin", value: "3582 mAh" },
      { name: "Hệ điều hành", value: "iOS 18" },
    ],
    "samsung-galaxy-s25-ultra-256gb": [
      { name: "Màn hình", value: "6.9 inch Dynamic AMOLED 2X" },
      { name: "Chip", value: "Snapdragon 8 Elite" },
      { name: "RAM", value: "12GB" },
      { name: "Camera sau", value: "200MP + 50MP + 10MP + 10MP" },
      { name: "Pin", value: "5000 mAh" },
      { name: "Hệ điều hành", value: "Android 15" },
    ],
    "xiaomi-14-ultra-512gb": [
      { name: "Màn hình", value: "6.73 inch LTPO AMOLED" },
      { name: "Chip", value: "Snapdragon 8 Gen 3" },
      { name: "RAM", value: "16GB" },
      { name: "Camera sau", value: "50MP Leica x4" },
      { name: "Pin", value: "5000 mAh" },
      { name: "Hệ điều hành", value: "Android 14" },
    ],
  };

  for (const [slug, specList] of Object.entries(specs)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) continue;

    // Xóa specs cũ rồi insert mới
    await prisma.productSpecification.deleteMany({
      where: { productId: product.id },
    });
    await prisma.productSpecification.createMany({
      data: specList.map((s) => ({ ...s, productId: product.id })),
    });
  }

  console.log("✅ Specifications");

  // ========================
  // VOUCHERS
  // ========================
  await prisma.voucher.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENT",
      discount: 10,
      maxDiscount: 500000,
      minOrderValue: 1000000,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 1000,
      usagePerUser: 1,
      isActive: true,
    },
  });

  await prisma.voucher.upsert({
    where: { code: "SALE500K" },
    update: {},
    create: {
      code: "SALE500K",
      type: "FIXED",
      discount: 500000,
      minOrderValue: 5000000,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 500,
      usagePerUser: 2,
      isActive: true,
    },
  });

  console.log("✅ Vouchers");

  // ========================
  // BANNERS & SLIDERS
  // ========================
  await prisma.banner.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "iPhone 16 Pro - Đỉnh cao công nghệ",
        image: "/banners/iphone16pro.jpg",
        link: "/products/iphone-16-pro-256gb",
        sortOrder: 1,
      },
      {
        title: "Galaxy S25 Ultra - Siêu phẩm Android",
        image: "/banners/s25ultra.jpg",
        link: "/products/samsung-galaxy-s25-ultra-256gb",
        sortOrder: 2,
      },
      {
        title: "Xiaomi 14 Ultra - Camera Leica",
        image: "/banners/xiaomi14ultra.jpg",
        link: "/products/xiaomi-14-ultra-512gb",
        sortOrder: 3,
      },
    ],
  });

  await prisma.slider.createMany({
    skipDuplicates: true,
    data: [
      {
        image: "/sliders/slide1.jpg",
        title: "Flash Sale Hôm Nay",
        subTitle: "Giảm đến 30%",
        link: "/flash-sale",
        sortOrder: 1,
      },
      {
        image: "/sliders/slide2.jpg",
        title: "Miễn phí vận chuyển",
        subTitle: "Cho đơn từ 500K",
        sortOrder: 2,
      },
    ],
  });

  console.log("✅ Banners & Sliders");

  console.log("\n🎉 Seed hoàn tất!");
}

main()
  .catch((e) => {
    console.error("❌ Seed lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
