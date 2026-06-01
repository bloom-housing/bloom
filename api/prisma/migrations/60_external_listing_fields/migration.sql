-- AlterTable
ALTER TABLE "listing_snapshot" ADD COLUMN     "external_jurisdiction_id" UUID,
ADD COLUMN     "external_listing_id" UUID,
ADD COLUMN     "external_url" TEXT;

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "external_jurisdiction_id" UUID,
ADD COLUMN     "external_listing_id" UUID,
ADD COLUMN     "external_url" TEXT;
