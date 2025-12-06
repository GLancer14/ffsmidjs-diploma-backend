-- DropIndex
DROP INDEX "SupportRequest_id_key";

-- AlterTable
CREATE SEQUENCE supportrequest_id_seq;
ALTER TABLE "SupportRequest" ALTER COLUMN "id" SET DEFAULT nextval('supportrequest_id_seq');
ALTER SEQUENCE supportrequest_id_seq OWNED BY "SupportRequest"."id";
