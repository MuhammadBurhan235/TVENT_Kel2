-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_event` VARCHAR(255) NOT NULL,
    `deskripsi_event` TEXT NULL,
    `poster_event` VARCHAR(255) NOT NULL,
    `penyelenggara_event` VARCHAR(255) NOT NULL,
    `benefit_event` TEXT NULL,
    `kepanitiaan_mulai` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `kepanitiaan_selesai` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `klasifikasi_divisi` TEXT NULL,
    `event_mulai` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `event_selesai` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `email_event` VARCHAR(255) NULL,
    `status` ENUM('ON REVIEW', 'ON GOING', 'REJECTED', 'DONE') NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_nim` VARCHAR(20) NULL,

    INDEX `user_nim`(`user_nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `nim` VARCHAR(20) NOT NULL,
    `nama_depan` VARCHAR(255) NULL,
    `nama_belakang` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `fakultas` VARCHAR(255) NOT NULL,
    `program_studi` VARCHAR(255) NOT NULL,
    `gender` ENUM('L', 'P') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`nim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_registered` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_nim` VARCHAR(20) NULL,
    `event_id` INTEGER NULL,
    `alasan_join` TEXT NULL,
    `cv` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `event_id`(`event_id`),
    INDEX `user_nim`(`user_nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_session` (
    `id` VARCHAR(255) NOT NULL,
    `admin_id` INTEGER NULL,

    INDEX `admin_id`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_session` (
    `id` VARCHAR(255) NOT NULL,
    `user_nim` VARCHAR(20) NULL,

    INDEX `user_nim`(`user_nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`user_nim`) REFERENCES `user`(`nim`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_registered` ADD CONSTRAINT `user_registered_ibfk_1` FOREIGN KEY (`user_nim`) REFERENCES `user`(`nim`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_registered` ADD CONSTRAINT `user_registered_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `admin_session` ADD CONSTRAINT `admin_session_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_session` ADD CONSTRAINT `user_session_ibfk_1` FOREIGN KEY (`user_nim`) REFERENCES `user`(`nim`) ON DELETE CASCADE ON UPDATE RESTRICT;
