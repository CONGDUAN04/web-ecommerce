/*
  Warnings:

  - A unique constraint covering the columns `[productGroupId,storage]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `storage` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `products_productGroupId_storage_key` ON `products`(`productGroupId`, `storage`);
