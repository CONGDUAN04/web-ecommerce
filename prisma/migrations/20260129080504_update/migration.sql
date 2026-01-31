/*
  Warnings:

  - You are about to drop the column `storage` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productGroupId,name]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_productGroupId_fkey`;

-- DropIndex
DROP INDEX `products_productGroupId_storage_key` ON `products`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `storage`;

-- CreateIndex
CREATE UNIQUE INDEX `products_productGroupId_name_key` ON `products`(`productGroupId`, `name`);

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
