-- CreateEnum
CREATE TYPE "lottery_status_enum" AS ENUM ('errored', 'ran', 'approved', 'releasedToPartners', 'publishedToPublic', 'expired');

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "lottery_status" "lottery_status_enum";
