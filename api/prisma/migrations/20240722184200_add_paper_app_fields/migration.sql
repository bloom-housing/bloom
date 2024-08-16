-- AlterTable
ALTER TABLE "applications"
ADD COLUMN     "received_at" TIMESTAMPTZ(6),
ADD COLUMN     "received_by" TEXT;
