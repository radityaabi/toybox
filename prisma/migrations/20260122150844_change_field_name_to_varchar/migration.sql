/*
  Warnings:

  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `toys` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "toys" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);
