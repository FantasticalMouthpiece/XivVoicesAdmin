/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL;

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "sentence" TEXT NOT NULL,
    "npcId" TEXT NOT NULL,
    "skeletonId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "tribe" TEXT NOT NULL,
    "eyes" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
