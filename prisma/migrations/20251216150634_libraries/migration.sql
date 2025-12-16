-- DropForeignKey
ALTER TABLE "BookOnLibrary" DROP CONSTRAINT "BookOnLibrary_libraryId_fkey";

-- AddForeignKey
ALTER TABLE "BookOnLibrary" ADD CONSTRAINT "BookOnLibrary_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;
