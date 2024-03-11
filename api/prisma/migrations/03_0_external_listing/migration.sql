ALTER TABLE
    "applications" DROP COLUMN "income_vouchers",
ADD
    COLUMN "income_vouchers" TEXT [];

ALTER TABLE
    "demographics"
ADD
    COLUMN "spoken_language" TEXT;

ALTER TABLE
    "jurisdictions"
ADD
    COLUMN "enable_listing_opportunity" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "external_listings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "assets" JSONB NOT NULL,
    "household_size_min" INTEGER,
    "household_size_max" INTEGER,
    "units_available" INTEGER,
    "application_due_date" TIMESTAMP(6),
    "application_open_date" TIMESTAMP(6),
    "name" TEXT NOT NULL,
    "waitlist_current_size" INTEGER,
    "waitlist_max_size" INTEGER,
    "is_waitlist_open" BOOLEAN,
    "status" TEXT NOT NULL,
    "review_order_type" TEXT NOT NULL,
    "closed_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published_at" TIMESTAMP(6),
    "last_application_update_at" TIMESTAMP(6) DEFAULT '1970-01-01 00:00:00-07' :: timestamp with time zone,
    "neighborhood" TEXT,
    "reserved_community_type_name" TEXT,
    "url_slug" TEXT NOT NULL,
    "units_summarized" JSONB,
    "images" JSONB,
    "multiselect_questions" JSONB,
    "jurisdiction" JSONB,
    "reserved_community_type" JSONB,
    "units" JSONB,
    "building_address" JSONB,
    "features" JSONB,
    "utilities" JSONB,
    CONSTRAINT "ExternalListing_pkey" PRIMARY KEY ("id")
);