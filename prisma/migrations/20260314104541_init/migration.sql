/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "plan",
DROP COLUMN "role",
ADD COLUMN     "name" TEXT;

-- DropEnum
DROP TYPE "Plan";

-- DropEnum
DROP TYPE "Role";
