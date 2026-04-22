/*
  Warnings:

  - You are about to alter the column `value` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - Added the required column `updatedAt` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "value" SET DATA TYPE SMALLINT;

-- CreateIndex
CREATE INDEX "Book_uploadedById_idx" ON "Book"("uploadedById");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_bookId_idx" ON "Comment"("bookId");
