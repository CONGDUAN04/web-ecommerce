/*
  Warnings:

  - You are about to alter the column `status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `paymentMethod` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `paymentStatus` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `provider` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - You are about to alter the column `status` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.
  - You are about to drop the column `desc` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_roleId_fkey`;

-- DropIndex
DROP INDEX `users_roleId_fkey` ON `users`;

-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED', 'RETURNED') NOT NULL DEFAULT 'PENDING',
    MODIFY `paymentMethod` ENUM('COD', 'PAYPAL', 'BANKING') NOT NULL,
    MODIFY `paymentStatus` ENUM('PAYMENT_UNPAID', 'PAYMENT_PAID', 'PAYMENT_PENDING') NOT NULL DEFAULT 'PAYMENT_UNPAID';

-- AlterTable
ALTER TABLE `payments` MODIFY `provider` ENUM('COD', 'PAYPAL', 'VNPAY', 'STRIPE') NOT NULL,
    MODIFY `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `desc`,
    ADD COLUMN `description` MEDIUMTEXT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `accountType` ENUM('SYSTEM', 'GOOGLE', 'GITHUB') NOT NULL DEFAULT 'SYSTEM',
    MODIFY `roleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
