-- AlterTable
ALTER TABLE `Category` ADD COLUMN `icon` VARCHAR(191) NULL,
    ADD COLUMN `iconId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `lastLoginAt` DATETIME(3) NULL,
    ADD COLUMN `passwordChangedAt` DATETIME(3) NULL,
    ADD COLUMN `resetPasswordExpire` DATETIME(3) NULL,
    ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL;
