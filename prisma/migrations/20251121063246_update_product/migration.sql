/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `product_variant_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `product_variant_images` DROP FOREIGN KEY `product_variant_images_variantId_fkey`;

-- AlterTable
ALTER TABLE `product_variants` ADD COLUMN `sold` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `price`;

-- DropTable
DROP TABLE `product_variant_images`;
