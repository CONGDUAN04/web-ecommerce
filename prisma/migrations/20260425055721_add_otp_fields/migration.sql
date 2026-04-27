/*
  Warnings:

  - You are about to drop the column `resetPasswordExpire` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verifyToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verifyTokenExpire` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `resetPasswordExpire`,
    DROP COLUMN `resetPasswordToken`,
    DROP COLUMN `verifyToken`,
    DROP COLUMN `verifyTokenExpire`,
    ADD COLUMN `otp` VARCHAR(191) NULL,
    ADD COLUMN `otpAttempt` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `otpExpire` DATETIME(3) NULL,
    ADD COLUMN `otpSentAt` DATETIME(3) NULL,
    ADD COLUMN `otpType` ENUM('VERIFY_EMAIL', 'RESET_PASSWORD') NULL;
