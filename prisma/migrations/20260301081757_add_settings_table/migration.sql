-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `mailService` VARCHAR(191) NOT NULL DEFAULT 'SMTP',
    `smtpHost` VARCHAR(191) NULL,
    `smtpPort` INTEGER NULL DEFAULT 587,
    `smtpUser` VARCHAR(191) NULL,
    `smtpPass` VARCHAR(191) NULL,
    `resendApiKey` VARCHAR(191) NULL,
    `fromEmail` VARCHAR(191) NOT NULL DEFAULT 'noreply@gozplatformu.com',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
