/*
  Warnings:

  - You are about to alter the column `fullName` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `address` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `title` on the `banners` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `image` on the `banners` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `link` on the `banners` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `name` on the `brands` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `imageBrand` on the `brands` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `image` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `image` on the `color_variants` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `receiverAddress` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `receiverName` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `receiverPhone` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `imageUrl` on the `product_images` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `name` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `thumbnail` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `image` on the `sliders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `title` on the `sliders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `subTitle` on the `sliders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `link` on the `sliders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `name` on the `specifications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `value` on the `specifications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.
  - You are about to drop the column `accountType` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `fullName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `address` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `phone` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `avatar` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_detail_variants` DROP FOREIGN KEY `cart_detail_variants_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_detail_variants` DROP FOREIGN KEY `cart_detail_variants_storageId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_details` DROP FOREIGN KEY `cart_details_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_details` DROP FOREIGN KEY `cart_details_productId_fkey`;

-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `color_variants` DROP FOREIGN KEY `color_variants_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product_images` DROP FOREIGN KEY `product_images_productId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_productId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_userId_fkey`;

-- DropForeignKey
ALTER TABLE `specifications` DROP FOREIGN KEY `specifications_productId_fkey`;

-- DropForeignKey
ALTER TABLE `storage_variants` DROP FOREIGN KEY `storage_variants_colorId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlists` DROP FOREIGN KEY `wishlists_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlists` DROP FOREIGN KEY `wishlists_userId_fkey`;

-- DropIndex
DROP INDEX `addresses_userId_fkey` ON `addresses`;

-- DropIndex
DROP INDEX `cart_detail_variants_cartId_fkey` ON `cart_detail_variants`;

-- DropIndex
DROP INDEX `cart_detail_variants_storageId_fkey` ON `cart_detail_variants`;

-- DropIndex
DROP INDEX `cart_details_cartId_fkey` ON `cart_details`;

-- DropIndex
DROP INDEX `cart_details_productId_fkey` ON `cart_details`;

-- DropIndex
DROP INDEX `color_variants_productId_idx` ON `color_variants`;

-- DropIndex
DROP INDEX `product_images_productId_fkey` ON `product_images`;

-- DropIndex
DROP INDEX `reviews_productId_idx` ON `reviews`;

-- DropIndex
DROP INDEX `specifications_productId_fkey` ON `specifications`;

-- DropIndex
DROP INDEX `storage_variants_colorId_idx` ON `storage_variants`;

-- DropIndex
DROP INDEX `vouchers_code_idx` ON `vouchers`;

-- DropIndex
DROP INDEX `wishlists_productId_idx` ON `wishlists`;

-- DropIndex
DROP INDEX `wishlists_userId_idx` ON `wishlists`;

-- AlterTable
ALTER TABLE `addresses` MODIFY `fullName` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `banners` MODIFY `title` VARCHAR(191) NULL,
    MODIFY `image` VARCHAR(191) NOT NULL,
    MODIFY `link` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `brands` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `imageBrand` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `categories` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `color_variants` MODIFY `color` VARCHAR(191) NOT NULL,
    MODIFY `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `orders` MODIFY `receiverAddress` VARCHAR(191) NOT NULL,
    MODIFY `receiverName` VARCHAR(191) NOT NULL,
    MODIFY `receiverPhone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `payments` MODIFY `provider` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product_images` MODIFY `imageUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `thumbnail` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reviews` MODIFY `comment` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sliders` MODIFY `image` VARCHAR(191) NOT NULL,
    MODIFY `title` VARCHAR(191) NULL,
    MODIFY `subTitle` VARCHAR(191) NULL,
    MODIFY `link` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `specifications` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `storage_variants` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `targets` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `accountType`,
    MODIFY `fullName` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `avatar` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vouchers` MODIFY `code` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `color_variants` ADD CONSTRAINT `color_variants_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `storage_variants` ADD CONSTRAINT `storage_variants_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `color_variants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_detail_variants` ADD CONSTRAINT `cart_detail_variants_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_detail_variants` ADD CONSTRAINT `cart_detail_variants_storageId_fkey` FOREIGN KEY (`storageId`) REFERENCES `storage_variants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `specifications` ADD CONSTRAINT `specifications_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
