-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "community_disclaimer_description" TEXT,
ADD COLUMN     "community_disclaimer_title" TEXT,
ADD COLUMN     "include_community_disclaimer" BOOLEAN;
