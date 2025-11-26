/*
  Warnings:

  - You are about to drop the column `factory` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `factory`,
    DROP COLUMN `target`,
    ADD COLUMN `brandId` INTEGER NULL,
    ADD COLUMN `targetId` INTEGER NULL;

-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `brands_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `targets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `targets_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `products_brandId_idx` ON `products`(`brandId`);

-- CreateIndex
CREATE INDEX `products_targetId_idx` ON `products`(`targetId`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `targets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
