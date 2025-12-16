/*
  Warnings:

  - You are about to drop the column `libraryId` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "libraryId";

-- CreateTable
CREATE TABLE "BookOnLibrary" (
    "bookId" INTEGER NOT NULL,
    "libraryId" INTEGER NOT NULL,
    "booksAmount" INTEGER NOT NULL,

    CONSTRAINT "BookOnLibrary_pkey" PRIMARY KEY ("bookId","libraryId")
);

-- AddForeignKey
ALTER TABLE "BookOnLibrary" ADD CONSTRAINT "BookOnLibrary_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOnLibrary" ADD CONSTRAINT "BookOnLibrary_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
