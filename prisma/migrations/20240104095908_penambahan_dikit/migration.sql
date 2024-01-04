/*
  Warnings:

  - The values [DONE] on the enum `event_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `status` ENUM('PENDING', 'REJECTED', 'ACCEPTED') NULL;
