/*
  Warnings:

  - You are about to drop the column `quantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `variantKey` on the `variants` table. All the data in the column will be lost.
  - You are about to drop the column `variantValue` on the `variants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `variants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sku` to the `variants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `variants` DROP FOREIGN KEY `variants_productId_fkey`;

-- DropIndex
DROP INDEX `variants_productId_variantKey_variantValue_key` ON `variants`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `quantity`;

-- AlterTable
ALTER TABLE `variants` DROP COLUMN `variantKey`,
    DROP COLUMN `variantValue`,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `attributes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute_values` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `attributeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_attributes` (
    `productId` INTEGER NOT NULL,
    `attributeId` INTEGER NOT NULL,

    PRIMARY KEY (`productId`, `attributeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variant_attributes` (
    `variantId` INTEGER NOT NULL,
    `valueId` INTEGER NOT NULL,

    PRIMARY KEY (`variantId`, `valueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `product_groups_isActive_idx` ON `product_groups`(`isActive`);

-- CreateIndex
CREATE INDEX `products_isActive_idx` ON `products`(`isActive`);

-- CreateIndex
CREATE UNIQUE INDEX `variants_sku_key` ON `variants`(`sku`);

-- CreateIndex
CREATE INDEX `variants_productId_idx` ON `variants`(`productId`);

-- AddForeignKey
ALTER TABLE `attribute_values` ADD CONSTRAINT `attribute_values_attributeId_fkey` FOREIGN KEY (`attributeId`) REFERENCES `attributes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_attributes` ADD CONSTRAINT `product_attributes_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_attributes` ADD CONSTRAINT `product_attributes_attributeId_fkey` FOREIGN KEY (`attributeId`) REFERENCES `attributes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variant_attributes` ADD CONSTRAINT `variant_attributes_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variant_attributes` ADD CONSTRAINT `variant_attributes_valueId_fkey` FOREIGN KEY (`valueId`) REFERENCES `attribute_values`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_logs` ADD CONSTRAINT `inventory_logs_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
