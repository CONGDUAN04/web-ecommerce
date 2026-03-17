/*
  Warnings:

  - Added the required column `brandId` to the `ProductGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `ProductGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productgroup` ADD COLUMN `brandId` INTEGER NOT NULL,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `ProductGroup_brandId_idx` ON `ProductGroup`(`brandId`);

-- CreateIndex
CREATE INDEX `ProductGroup_categoryId_idx` ON `ProductGroup`(`categoryId`);

-- AddForeignKey
ALTER TABLE `ProductGroup` ADD CONSTRAINT `ProductGroup_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductGroup` ADD CONSTRAINT `ProductGroup_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
