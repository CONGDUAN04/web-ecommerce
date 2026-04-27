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
  const adminRoleSuper = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: { name: "SUPER_ADMIN", description: "Quản trị viên" },
  });

  await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER", description: "Người dùng" },
  });

  console.log("✅ Roles");
}

main()
  .catch((e) => {
    console.error("❌ Seed lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
