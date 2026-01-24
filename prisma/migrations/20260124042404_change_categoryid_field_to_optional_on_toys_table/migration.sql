-- DropForeignKey
ALTER TABLE "toys" DROP CONSTRAINT "toys_categoryId_fkey";

-- AlterTable
ALTER TABLE "toys" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "toys" ADD CONSTRAINT "toys_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
