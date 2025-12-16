/*
  Warnings:

  - You are about to drop the `BookOnLibrary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `libraryId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookOnLibrary" DROP CONSTRAINT "BookOnLibrary_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookOnLibrary" DROP CONSTRAINT "BookOnLibrary_libraryId_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "libraryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BookOnLibrary";
