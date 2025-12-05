/*
  Warnings:

  - Added the required column `supportRequestId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SupportRequest" DROP CONSTRAINT "SupportRequest_user_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "supportRequestId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_supportRequestId_fkey" FOREIGN KEY ("supportRequestId") REFERENCES "SupportRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
