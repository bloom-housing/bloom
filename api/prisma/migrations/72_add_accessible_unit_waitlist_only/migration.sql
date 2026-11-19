-- AlterTable
ALTER TABLE "listings" ADD COLUMN "accessible_unit_waitlist_only" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "listing_snapshot" ADD COLUMN "accessible_unit_waitlist_only" BOOLEAN DEFAULT false;
