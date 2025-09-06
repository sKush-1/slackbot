/*
  Warnings:

  - Added the required column `teamId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "teamId" TEXT NOT NULL;
