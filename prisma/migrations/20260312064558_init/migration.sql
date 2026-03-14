/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantInfo` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `district` VARCHAR(191) NULL,
    ADD COLUMN `province` VARCHAR(191) NULL,
    ADD COLUMN `ward` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `banner` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `cancelReason` VARCHAR(191) NULL,
    ADD COLUMN `cancelledAt` DATETIME(3) NULL,
    ADD COLUMN `completedAt` DATETIME(3) NULL,
    ADD COLUMN `confirmedAt` DATETIME(3) NULL,
    ADD COLUMN `note` VARCHAR(191) NULL,
    ADD COLUMN `shippedAt` DATETIME(3) NULL,
    ADD COLUMN `shippingFee` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `shippingMethod` VARCHAR(191) NULL,
    ADD COLUMN `trackingCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `productName` VARCHAR(191) NOT NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL,
    ADD COLUMN `variantInfo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `transactionId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `groupId` INTEGER NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `isHidden` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `comment` TEXT NULL;

-- AlterTable
ALTER TABLE `variant` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `voucher` ADD COLUMN `usagePerUser` INTEGER NULL;

-- CreateTable
CREATE TABLE `ProductGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProductGroup_slug_key`(`slug`),
    INDEX `ProductGroup_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Imei` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `isSold` BOOLEAN NOT NULL DEFAULT false,
    `variantId` INTEGER NOT NULL,
    `orderItemId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Imei_code_key`(`code`),
    UNIQUE INDEX `Imei_orderItemId_key`(`orderItemId`),
    INDEX `Imei_variantId_idx`(`variantId`),
    INDEX `Imei_isSold_idx`(`isSold`),
    INDEX `Imei_variantId_isSold_idx`(`variantId`, `isSold`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoucherUsage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `voucherId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VoucherUsage_orderId_key`(`orderId`),
    INDEX `VoucherUsage_userId_voucherId_idx`(`userId`, `voucherId`),
    INDEX `VoucherUsage_voucherId_idx`(`voucherId`),
    UNIQUE INDEX `VoucherUsage_userId_voucherId_orderId_key`(`userId`, `voucherId`, `orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageUrl` VARCHAR(191) NOT NULL,
    `reviewId` INTEGER NOT NULL,

    INDEX `ReviewImage_reviewId_idx`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewReply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comment` TEXT NOT NULL,
    `reviewId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ReviewReply_reviewId_idx`(`reviewId`),
    INDEX `ReviewReply_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlashSale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FlashSale_isActive_idx`(`isActive`),
    INDEX `FlashSale_startTime_endTime_idx`(`startTime`, `endTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlashSaleItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salePrice` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `sold` INTEGER NOT NULL DEFAULT 0,
    `flashSaleId` INTEGER NOT NULL,
    `variantId` INTEGER NOT NULL,

    INDEX `FlashSaleItem_flashSaleId_idx`(`flashSaleId`),
    INDEX `FlashSaleItem_variantId_idx`(`variantId`),
    UNIQUE INDEX `FlashSaleItem_flashSaleId_variantId_key`(`flashSaleId`, `variantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NULL,
    `type` ENUM('ORDER', 'PROMOTION', 'SYSTEM') NOT NULL DEFAULT 'SYSTEM',
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_isRead_idx`(`userId`, `isRead`),
    INDEX `Notification_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Address_userId_isDefault_idx` ON `Address`(`userId`, `isDefault`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_key` ON `Category`(`name`);

-- CreateIndex
CREATE INDEX `InventoryLog_action_idx` ON `InventoryLog`(`action`);

-- CreateIndex
CREATE INDEX `InventoryLog_variantId_createdAt_idx` ON `InventoryLog`(`variantId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Order_paymentStatus_idx` ON `Order`(`paymentStatus`);

-- CreateIndex
CREATE INDEX `Order_userId_status_idx` ON `Order`(`userId`, `status`);

-- CreateIndex
CREATE INDEX `Order_userId_createdAt_idx` ON `Order`(`userId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Order_status_createdAt_idx` ON `Order`(`status`, `createdAt`);

-- CreateIndex
CREATE INDEX `Payment_status_idx` ON `Payment`(`status`);

-- CreateIndex
CREATE INDEX `Payment_transactionId_idx` ON `Payment`(`transactionId`);

-- CreateIndex
CREATE INDEX `Product_groupId_idx` ON `Product`(`groupId`);

-- CreateIndex
CREATE INDEX `Product_isActive_categoryId_idx` ON `Product`(`isActive`, `categoryId`);

-- CreateIndex
CREATE INDEX `Product_isActive_brandId_idx` ON `Product`(`isActive`, `brandId`);

-- CreateIndex
CREATE INDEX `Product_viewCount_idx` ON `Product`(`viewCount`);

-- CreateIndex
CREATE INDEX `Product_createdAt_idx` ON `Product`(`createdAt`);

-- CreateIndex
CREATE INDEX `Review_userId_idx` ON `Review`(`userId`);

-- CreateIndex
CREATE INDEX `Review_productId_rating_idx` ON `Review`(`productId`, `rating`);

-- CreateIndex
CREATE INDEX `Review_productId_isHidden_createdAt_idx` ON `Review`(`productId`, `isHidden`, `createdAt`);

-- CreateIndex
CREATE INDEX `User_phone_idx` ON `User`(`phone`);

-- CreateIndex
CREATE INDEX `User_createdAt_idx` ON `User`(`createdAt`);

-- CreateIndex
CREATE INDEX `Variant_isActive_idx` ON `Variant`(`isActive`);

-- CreateIndex
CREATE INDEX `Variant_productId_isActive_idx` ON `Variant`(`productId`, `isActive`);

-- CreateIndex
CREATE INDEX `Variant_productId_price_idx` ON `Variant`(`productId`, `price`);

-- CreateIndex
CREATE INDEX `Voucher_isActive_idx` ON `Voucher`(`isActive`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `ProductGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imei` ADD CONSTRAINT `Imei_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `Variant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imei` ADD CONSTRAINT `Imei_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoucherUsage` ADD CONSTRAINT `VoucherUsage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoucherUsage` ADD CONSTRAINT `VoucherUsage_voucherId_fkey` FOREIGN KEY (`voucherId`) REFERENCES `Voucher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoucherUsage` ADD CONSTRAINT `VoucherUsage_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewImage` ADD CONSTRAINT `ReviewImage_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewReply` ADD CONSTRAINT `ReviewReply_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewReply` ADD CONSTRAINT `ReviewReply_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashSaleItem` ADD CONSTRAINT `FlashSaleItem_flashSaleId_fkey` FOREIGN KEY (`flashSaleId`) REFERENCES `FlashSale`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashSaleItem` ADD CONSTRAINT `FlashSaleItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `Variant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `cartitem` RENAME INDEX `CartItem_variantId_fkey` TO `CartItem_variantId_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_voucherId_fkey` TO `Order_voucherId_idx`;

-- RenameIndex
ALTER TABLE `orderitem` RENAME INDEX `OrderItem_variantId_fkey` TO `OrderItem_variantId_idx`;
