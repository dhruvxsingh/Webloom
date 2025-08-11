-- CreateTable
CREATE TABLE `Page` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'Home',
    `path` VARCHAR(191) NOT NULL DEFAULT '/',
    `content` JSON NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Page_projectId_idx`(`projectId`),
    UNIQUE INDEX `Page_projectId_path_key`(`projectId`, `path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `SubAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
