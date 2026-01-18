/*
  Warnings:

  - You are about to drop the `cart_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart_detail_variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_detail_variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cart_detail` DROP FOREIGN KEY `cart_detail_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_detail` DROP FOREIGN KEY `cart_detail_productId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_detail_variant` DROP FOREIGN KEY `cart_detail_variant_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_detail_variant` DROP FOREIGN KEY `cart_detail_variant_storageId_fkey`;

-- DropForeignKey
ALTER TABLE `order_detail` DROP FOREIGN KEY `order_detail_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `order_detail` DROP FOREIGN KEY `order_detail_productId_fkey`;

-- DropForeignKey
ALTER TABLE `order_detail_variant` DROP FOREIGN KEY `order_detail_variant_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `order_detail_variant` DROP FOREIGN KEY `order_detail_variant_storageId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `wishlist_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `wishlist_userId_fkey`;

-- DropTable
DROP TABLE `cart_detail`;

-- DropTable
DROP TABLE `cart_detail_variant`;

-- DropTable
DROP TABLE `order_detail`;

-- DropTable
DROP TABLE `order_detail_variant`;

-- DropTable
DROP TABLE `wishlist`;

-- CreateTable
CREATE TABLE `cart_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cartId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_detail_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cartId` INTEGER NOT NULL,
    `storageId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    INDEX `order_details_orderId_idx`(`orderId`),
    INDEX `order_details_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_detail_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orderId` INTEGER NOT NULL,
    `storageId` INTEGER NOT NULL,

    INDEX `order_detail_variants_orderId_idx`(`orderId`),
    INDEX `order_detail_variants_storageId_idx`(`storageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    INDEX `wishlists_userId_idx`(`userId`),
    INDEX `wishlists_productId_idx`(`productId`),
    UNIQUE INDEX `wishlists_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_detail_variants` ADD CONSTRAINT `cart_detail_variants_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_detail_variants` ADD CONSTRAINT `cart_detail_variants_storageId_fkey` FOREIGN KEY (`storageId`) REFERENCES `storage_variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_detail_variants` ADD CONSTRAINT `order_detail_variants_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_detail_variants` ADD CONSTRAINT `order_detail_variants_storageId_fkey` FOREIGN KEY (`storageId`) REFERENCES `storage_variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
