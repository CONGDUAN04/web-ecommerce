/*
  Warnings:

  - You are about to drop the column `variantId` on the `cart_detail_variant` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `color_variants` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `order_detail_variant` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `desc` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `variants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `storageId` to the `cart_detail_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageId` to the `order_detail_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailDesc` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `factory` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDesc` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart_detail_variant` DROP FOREIGN KEY `cart_detail_variant_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `order_detail_variant` DROP FOREIGN KEY `order_detail_variant_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `variants` DROP FOREIGN KEY `variants_colorId_fkey`;

-- DropForeignKey
ALTER TABLE `variants` DROP FOREIGN KEY `variants_productId_fkey`;

-- DropIndex
DROP INDEX `cart_detail_variant_variantId_fkey` ON `cart_detail_variant`;

-- DropIndex
DROP INDEX `order_detail_variant_variantId_idx` ON `order_detail_variant`;

-- DropIndex
DROP INDEX `products_slug_key` ON `products`;

-- AlterTable
ALTER TABLE `cart_detail_variant` DROP COLUMN `variantId`,
    ADD COLUMN `storageId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `color_variants` DROP COLUMN `imageUrl`,
    ADD COLUMN `image` VARCHAR(255) NULL,
    MODIFY `color` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `order_detail_variant` DROP COLUMN `variantId`,
    ADD COLUMN `storageId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `createdAt`,
    DROP COLUMN `desc`,
    DROP COLUMN `slug`,
    DROP COLUMN `thumbnail`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `detailDesc` MEDIUMTEXT NOT NULL,
    ADD COLUMN `factory` VARCHAR(255) NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `shortDesc` VARCHAR(255) NOT NULL,
    ADD COLUMN `sold` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `target` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `variants`;

-- CreateTable
CREATE TABLE `storage_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `sold` INTEGER NOT NULL DEFAULT 0,
    `colorId` INTEGER NOT NULL,

    INDEX `storage_variants_colorId_idx`(`colorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `order_detail_variant_storageId_idx` ON `order_detail_variant`(`storageId`);

-- AddForeignKey
ALTER TABLE `storage_variants` ADD CONSTRAINT `storage_variants_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `color_variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_detail_variant` ADD CONSTRAINT `cart_detail_variant_storageId_fkey` FOREIGN KEY (`storageId`) REFERENCES `storage_variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_detail_variant` ADD CONSTRAINT `order_detail_variant_storageId_fkey` FOREIGN KEY (`storageId`) REFERENCES `storage_variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
