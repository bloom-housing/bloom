-- CreateTable
CREATE TABLE "listing_transfer_map" (
    "listing_id" UUID NOT NULL,
    "old_id" UUID NOT NULL,

    CONSTRAINT "listing_transfer_map_pkey" PRIMARY KEY ("listing_id")
);
