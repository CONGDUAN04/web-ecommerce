/*
  Warnings:

  - You are about to drop the column `detailDesc` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `factory` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `shortDesc` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart_detail_variant` DROP FOREIGN KEY `cart_detail_variant_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `order_detail_variant` DROP FOREIGN KEY `order_detail_variant_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `product_variants` DROP FOREIGN KEY `product_variants_productId_fkey`;

-- DropIndex
DROP INDEX `cart_detail_variant_variantId_fkey` ON `cart_detail_variant`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `detailDesc`,
    DROP COLUMN `factory`,
    DROP COLUMN `image`,
    DROP COLUMN `quantity`,
    DROP COLUMN `shortDesc`,
    DROP COLUMN `sold`,
    DROP COLUMN `target`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `desc` TEXT NULL,
    ADD COLUMN `slug` VARCHAR(255) NOT NULL,
    ADD COLUMN `thumbnail` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `product_variants`;

-- CreateTable
CREATE TABLE `color_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `color` VARCHAR(50) NOT NULL,
    `imageUrl` VARCHAR(255) NULL,

    INDEX `color_variants_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `colorId` INTEGER NOT NULL,
    `storage` VARCHAR(50) NOT NULL,
    `price` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `sku` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `productId` INTEGER NULL,

    UNIQUE INDEX `variants_sku_key`(`sku`),
    UNIQUE INDEX `variants_slug_key`(`slug`),
    INDEX `variants_colorId_idx`(`colorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `products_slug_key` ON `products`(`slug`);

-- AddForeignKey
ALTER TABLE `color_variants` ADD CONSTRAINT `color_variants_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variants` ADD CONSTRAINT `variants_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `color_variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variants` ADD CONSTRAINT `variants_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_detail_variant` ADD CONSTRAINT `cart_detail_variant_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_detail_variant` ADD CONSTRAINT `order_detail_variant_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
