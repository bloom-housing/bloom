-- AlterTable
ALTER TABLE "listings"
ADD COLUMN "scheduled_publish_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "listing_snapshot"
ADD COLUMN "scheduled_publish_at" TIMESTAMPTZ(6);
