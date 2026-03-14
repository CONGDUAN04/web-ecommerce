-- AlterTable
ALTER TABLE `user` ADD COLUMN `accountType` ENUM('SYSTEM', 'GOOGLE', 'GITHUB') NOT NULL DEFAULT 'SYSTEM',
    MODIFY `password` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `User_accountType_idx` ON `User`(`accountType`);
