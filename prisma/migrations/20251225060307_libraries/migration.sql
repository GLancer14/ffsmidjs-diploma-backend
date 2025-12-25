/*
  Warnings:

  - You are about to drop the column `isActive` on the `SupportRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user]` on the table `SupportRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_supportRequestId_fkey";

-- AlterTable
ALTER TABLE "BookRental" ADD COLUMN     "bookOnLibraryBookId" INTEGER,
ADD COLUMN     "bookOnLibraryLibraryId" INTEGER;

-- AlterTable
ALTER TABLE "SupportRequest" DROP COLUMN "isActive";

-- CreateTable
CREATE TABLE "MessageOnUser" (
    "authorId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "MessageOnUser_pkey" PRIMARY KEY ("authorId","messageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportRequest_user_key" ON "SupportRequest"("user");

-- AddForeignKey
ALTER TABLE "BookRental" ADD CONSTRAINT "BookRental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRental" ADD CONSTRAINT "BookRental_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRental" ADD CONSTRAINT "BookRental_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRental" ADD CONSTRAINT "BookRental_bookOnLibraryBookId_bookOnLibraryLibraryId_fkey" FOREIGN KEY ("bookOnLibraryBookId", "bookOnLibraryLibraryId") REFERENCES "BookOnLibrary"("bookId", "libraryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_supportRequestId_fkey" FOREIGN KEY ("supportRequestId") REFERENCES "SupportRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageOnUser" ADD CONSTRAINT "MessageOnUser_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageOnUser" ADD CONSTRAINT "MessageOnUser_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
