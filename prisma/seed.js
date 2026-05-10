// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { ACCOUNT_TYPE } from "../src/constants/index.js";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed data...");

  // ========================
  // ROLES
  // ========================
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
}

main()
  .catch((e) => {
    console.error("❌ Seed lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
