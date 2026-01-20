-- AlterTable
ALTER TABLE `color_variants` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `storage_variants` ADD COLUMN `deletedAt` DATETIME(3) NULL;
