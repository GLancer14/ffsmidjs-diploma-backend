/*
  Warnings:

  - You are about to drop the `MessageOnUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookRental" DROP CONSTRAINT "BookRental_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookRental" DROP CONSTRAINT "BookRental_libraryId_fkey";

-- DropForeignKey
ALTER TABLE "BookRental" DROP CONSTRAINT "BookRental_userId_fkey";

-- DropForeignKey
ALTER TABLE "MessageOnUser" DROP CONSTRAINT "MessageOnUser_authorId_fkey";

-- DropForeignKey
ALTER TABLE "MessageOnUser" DROP CONSTRAINT "MessageOnUser_messageId_fkey";

-- DropTable
DROP TABLE "MessageOnUser";

-- AddForeignKey
ALTER TABLE "BookRental" ADD CONSTRAINT "BookRental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRental" ADD CONSTRAINT "BookRental_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRental" ADD CONSTRAINT "BookRental_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
