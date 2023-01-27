-- AlterTable
ALTER TABLE `Property` ADD COLUMN `imageName` VARCHAR(191) NULL,
    MODIFY `image` VARCHAR(191) NULL;

-- CreateIndex
CREATE FULLTEXT INDEX `Property_address_idx` ON `Property`(`address`);
