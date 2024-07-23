-- AlterTable

ALTER TABLE "application_lottery_positions"
DROP CONSTRAINT "application_lottery_positions_pkey",
                ADD COLUMN "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                                                      ADD CONSTRAINT "application_lottery_positions_pkey" PRIMARY KEY ("id");

-- CreateIndex

CREATE INDEX "application_lottery_positions_listing_id_idx" ON "application_lottery_positions"("listing_id");

-- CreateIndex

CREATE INDEX "application_lottery_positions_application_id_idx" ON "application_lottery_positions"("application_id");

