-- CreateTable
CREATE TABLE "application_lottery_totals" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "total" INTEGER NOT NULL,
    "listing_id" UUID NOT NULL,
    "multiselect_question_id" UUID,

    CONSTRAINT "application_lottery_totals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_lottery_totals_listing_id_idx" ON "application_lottery_totals"("listing_id");

-- AddForeignKey
ALTER TABLE "application_lottery_totals" ADD CONSTRAINT "application_lottery_totals_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_lottery_totals" ADD CONSTRAINT "application_lottery_totals_multiselect_question_id_fkey" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
