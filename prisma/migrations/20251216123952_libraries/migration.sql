/*
  Warnings:

  - You are about to drop the column `availableCopies` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `libraryId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `totalCopies` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "availableCopies",
DROP COLUMN "isAvailable",
DROP COLUMN "libraryId",
DROP COLUMN "totalCopies";

-- CreateTable
CREATE TABLE "BookOnLibrary" (
    "bookId" INTEGER NOT NULL,
    "libraryId" INTEGER NOT NULL,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "availableCopies" INTEGER NOT NULL DEFAULT 1,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BookOnLibrary_pkey" PRIMARY KEY ("bookId","libraryId")
);

-- AddForeignKey
ALTER TABLE "BookOnLibrary" ADD CONSTRAINT "BookOnLibrary_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOnLibrary" ADD CONSTRAINT "BookOnLibrary_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
