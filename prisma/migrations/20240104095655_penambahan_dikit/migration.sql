/*
  Warnings:

  - The values [ON REVIEW,ON GOING] on the enum `event_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `status` ENUM('PENDING', 'REJECTED', 'DONE') NULL;

-- AlterTable
ALTER TABLE `user_registered` ADD COLUMN `divisi` VARCHAR(255) NULL,
    ADD COLUMN `jabatan` VARCHAR(255) NULL,
    ADD COLUMN `status` ENUM('REJECTED', 'ACCEPTED') NULL;
