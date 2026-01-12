-- DropForeignKey
ALTER TABLE "toys" DROP CONSTRAINT "toys_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "toys" ADD CONSTRAINT "toys_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
