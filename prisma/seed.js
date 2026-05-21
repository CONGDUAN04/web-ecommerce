// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { ACCOUNT_TYPE } from "../src/constants/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed data...");

  // ======================================================
  // ROLES
  // ======================================================
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Quản trị viên",
    },
  });

  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "Quản trị viên cấp cao",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
      description: "Người dùng",
    },
  });

  console.log("✅ Roles");

  // ======================================================
  // SUPER ADMIN
  // ======================================================
  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: {
      username: "superadmin@gmail.com",
    },
    update: {},
    create: {
      username: "superadmin@gmail.com",
      fullName: "Super Admin",
      password: hashedPassword,
      phone: "0123456789",
      accountType: ACCOUNT_TYPE.SYSTEM,
      isVerified: true,
      isActive: true,
      roleId: superAdminRole.id,
    },
  });

  console.log("✅ Super Admin Account");

  // ======================================================
  // CATEGORIES
  // ======================================================
  const phoneCategory = await prisma.category.upsert({
    where: { slug: "dien-thoai" },
    update: {},
    create: {
      name: "Điện thoại",
      slug: "dien-thoai",
    },
  });

  const laptopCategory = await prisma.category.upsert({
    where: { slug: "laptop" },
    update: {},
    create: {
      name: "Laptop",
      slug: "laptop",
    },
  });

  console.log("✅ Categories");

  // ======================================================
  // BRANDS
  // ======================================================
  const appleBrand = await prisma.brand.upsert({
    where: { slug: "apple" },
    update: {},
    create: {
      name: "Apple",
      slug: "apple",
    },
  });

  const samsungBrand = await prisma.brand.upsert({
    where: { slug: "samsung" },
    update: {},
    create: {
      name: "Samsung",
      slug: "samsung",
    },
  });

  const realmeBrand = await prisma.brand.upsert({
    where: { slug: "realme" },
    update: {},
    create: {
      name: "Realme",
      slug: "realme",
    },
  });

  const xiaomiBrand = await prisma.brand.upsert({
    where: { slug: "xiaomi" },
    update: {},
    create: {
      name: "Xiaomi",
      slug: "xiaomi",
    },
  });

  const dellBrand = await prisma.brand.upsert({
    where: { slug: "dell" },
    update: {},
    create: {
      name: "Dell",
      slug: "dell",
    },
  });

  const hpBrand = await prisma.brand.upsert({
    where: { slug: "hp" },
    update: {},
    create: {
      name: "HP",
      slug: "hp",
    },
  });

  const asusBrand = await prisma.brand.upsert({
    where: { slug: "asus" },
    update: {},
    create: {
      name: "Asus",
      slug: "asus",
    },
  });

  console.log("✅ Brands");

  // ======================================================
  // COLORS
  // ======================================================
  const blackColor = await prisma.color.upsert({
    where: { name: "Black" },
    update: {},
    create: {
      name: "Black",
      code: "#000000",
    },
  });

  const whiteColor = await prisma.color.upsert({
    where: { name: "White" },
    update: {},
    create: {
      name: "White",
      code: "#ffffff",
    },
  });

  console.log("✅ Colors");

  // ======================================================
  // PRODUCTS DATA
  // ======================================================
  const phoneProducts = [
    {
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      brand: appleBrand,
      price: 32990000,
      comparePrice: 35990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-15-pro-max_3.png",
    },
    {
      name: "iPhone 15",
      slug: "iphone-15",
      brand: appleBrand,
      price: 21990000,
      comparePrice: 24990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-15-plus_1.png",
    },
    {
      name: "iPhone 14 Pro",
      slug: "iphone-14-pro",
      brand: appleBrand,
      price: 25990000,
      comparePrice: 28990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-14-pro-max_2.png",
    },
    {
      name: "iPhone 13",
      slug: "iphone-13",
      brand: appleBrand,
      price: 15990000,
      comparePrice: 18990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_13_blue_1.png",
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      brand: samsungBrand,
      price: 28990000,
      comparePrice: 32990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/s/2/s24-ultra-xam-222.png",
    },
    {
      name: "Samsung Galaxy S24",
      slug: "samsung-galaxy-s24",
      brand: samsungBrand,
      price: 20990000,
      comparePrice: 23990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/s/2/s24_1.png",
    },
    {
      name: "Samsung Galaxy A55",
      slug: "samsung-galaxy-a55",
      brand: samsungBrand,
      price: 9990000,
      comparePrice: 11990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/a/5/a55-xanh.png",
    },
    {
      name: "Realme C67",
      slug: "realme-c67",
      brand: realmeBrand,
      price: 4990000,
      comparePrice: 5990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/r/e/realme-c67.png",
    },
    {
      name: "Realme 12 Pro Plus",
      slug: "realme-12-pro-plus",
      brand: realmeBrand,
      price: 10990000,
      comparePrice: 12990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/r/e/realme-12-pro-plus.png",
    },
    {
      name: "Xiaomi Redmi Note 13",
      slug: "xiaomi-redmi-note-13",
      brand: xiaomiBrand,
      price: 6990000,
      comparePrice: 7990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/r/e/redmi-note-13.png",
    },
    {
      name: "Xiaomi 14",
      slug: "xiaomi-14",
      brand: xiaomiBrand,
      price: 22990000,
      comparePrice: 24990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/x/i/xiaomi_14.png",
    },
    {
      name: "iPhone 12",
      slug: "iphone-12",
      brand: appleBrand,
      price: 11990000,
      comparePrice: 13990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-12_1.png",
    },
  ];

  const laptopProducts = [
    {
      name: "MacBook Air M2",
      slug: "macbook-air-m2",
      brand: appleBrand,
      price: 24990000,
      comparePrice: 27990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook_air_m2.png",
    },
    {
      name: "MacBook Pro M3",
      slug: "macbook-pro-m3",
      brand: appleBrand,
      price: 42990000,
      comparePrice: 45990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook-pro-m3.png",
    },
    {
      name: "Dell XPS 13",
      slug: "dell-xps-13",
      brand: dellBrand,
      price: 28990000,
      comparePrice: 31990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/d/e/dell-xps-13.png",
    },
    {
      name: "Dell Inspiron 15",
      slug: "dell-inspiron-15",
      brand: dellBrand,
      price: 17990000,
      comparePrice: 19990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/d/e/dell-inspiron-15.png",
    },
    {
      name: "HP Pavilion 15",
      slug: "hp-pavilion-15",
      brand: hpBrand,
      price: 16990000,
      comparePrice: 18990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/h/p/hp-pavilion-15.png",
    },
    {
      name: "HP Victus Gaming",
      slug: "hp-victus-gaming",
      brand: hpBrand,
      price: 23990000,
      comparePrice: 26990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/h/p/hp-victus.png",
    },
    {
      name: "Asus ROG Strix",
      slug: "asus-rog-strix",
      brand: asusBrand,
      price: 32990000,
      comparePrice: 35990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/r/o/rog-strix.png",
    },
    {
      name: "Asus Vivobook 15",
      slug: "asus-vivobook-15",
      brand: asusBrand,
      price: 14990000,
      comparePrice: 16990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/v/i/vivobook-15.png",
    },
    {
      name: "Asus TUF Gaming",
      slug: "asus-tuf-gaming",
      brand: asusBrand,
      price: 25990000,
      comparePrice: 28990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/u/tuf-gaming.png",
    },
    {
      name: "Dell Gaming G15",
      slug: "dell-gaming-g15",
      brand: dellBrand,
      price: 27990000,
      comparePrice: 30990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/d/e/dell-g15.png",
    },
    {
      name: "MacBook Air M1",
      slug: "macbook-air-m1",
      brand: appleBrand,
      price: 18990000,
      comparePrice: 21990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook-air-m1.png",
    },
    {
      name: "HP Envy x360",
      slug: "hp-envy-x360",
      brand: hpBrand,
      price: 22990000,
      comparePrice: 24990000,
      thumbnail:
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/h/p/hp-envy.png",
    },
  ];

  // ======================================================
  // CREATE PRODUCTS
  // ======================================================
  const allProducts = [
    ...phoneProducts.map((p) => ({
      ...p,
      category: phoneCategory,
    })),
    ...laptopProducts.map((p) => ({
      ...p,
      category: laptopCategory,
    })),
  ];

  for (const item of allProducts) {
    const group = await prisma.productGroup.upsert({
      where: {
        slug: `${item.slug}-group`,
      },
      update: {},
      create: {
        name: item.name,
        slug: `${item.slug}-group`,
        brandId: item.brand.id,
        categoryId: item.category.id,
      },
    });

    const product = await prisma.product.upsert({
      where: {
        slug: item.slug,
      },
      update: {},
      create: {
        name: item.name,
        slug: item.slug,
        description: `${item.name} chính hãng, hiệu năng mạnh.`,
        thumbnail: item.thumbnail,
        brandId: item.brand.id,
        categoryId: item.category.id,
        groupId: group.id,
      },
    });

    const productColor = await prisma.productColor.upsert({
      where: {
        productId_colorId: {
          productId: product.id,
          colorId: blackColor.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        colorId: blackColor.id,
        image: item.thumbnail,
      },
    });

    await prisma.variant.create({
      data: {
        sku: `SKU-${item.slug.toUpperCase()}`,
        storage: "256GB",
        price: item.price,
        comparePrice: item.comparePrice,
        quantity: 100,
        sold: Math.floor(Math.random() * 100),
        productId: product.id,
        productColorId: productColor.id,
      },
    });

    console.log(`✅ ${item.name}`);
  }

  console.log("🎉 Seed hoàn tất!");
}

main()
  .catch((e) => {
    console.error("❌ Seed lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
