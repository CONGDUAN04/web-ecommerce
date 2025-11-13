import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();

// Nếu chưa có, gán vào global
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;

