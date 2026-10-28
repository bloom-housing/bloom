-- AlterTable
ALTER TABLE "listings"
ADD COLUMN "scheduled_application_open_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "listing_snapshot"
ADD COLUMN "scheduled_application_open_at" TIMESTAMPTZ(6);
