-- AlterTable
ALTER TABLE `productgroup` ADD COLUMN `series` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Product_isActive_groupId_idx` ON `Product`(`isActive`, `groupId`);

-- CreateIndex
CREATE INDEX `ProductGroup_series_idx` ON `ProductGroup`(`series`);

-- CreateIndex
CREATE INDEX `ProductGroup_brandId_series_idx` ON `ProductGroup`(`brandId`, `series`);

-- CreateIndex
CREATE INDEX `Variant_productId_storage_idx` ON `Variant`(`productId`, `storage`);

-- CreateIndex
CREATE INDEX `Variant_productId_color_idx` ON `Variant`(`productId`, `color`);
