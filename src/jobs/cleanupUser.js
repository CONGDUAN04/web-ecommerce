import cron from "node-cron";
import prisma from "../config/client.js";
import { OtpType } from "@prisma/client";

cron.schedule("* * * * *", async () => {
  const users = await prisma.user.findMany({
    where: {
      isVerified: false,
    },
  });
  const matchUsers = await prisma.user.findMany({
    where: {
      isVerified: false,
      otpType: OtpType.VERIFY_EMAIL,

      AND: [
        {
          otpExpire: {
            lt: new Date(),
          },
        },
        {
          createdAt: {
            lt: new Date(Date.now() - 30 * 60 * 1000),
          },
        },
      ],
    },
  });
  const result = await prisma.user.deleteMany({
    where: {
      isVerified: false,
      otpType: OtpType.VERIFY_EMAIL,

      AND: [
        {
          otpExpire: {
            lt: new Date(),
          },
        },
        {
          createdAt: {
            lt: new Date(Date.now() - 30 * 60 * 1000),
          },
        },
      ],
    },
  });
});
