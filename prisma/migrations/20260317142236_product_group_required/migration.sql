/*
  Warnings:

  - Made the column `groupId` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_groupId_fkey`;

-- AlterTable
ALTER TABLE `product` MODIFY `groupId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `ProductGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
