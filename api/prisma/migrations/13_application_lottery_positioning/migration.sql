-- CreateTable
CREATE TABLE "application_lottery_positions" (
    "ordinal" INTEGER NOT NULL,
    "listing_id" UUID NOT NULL,
    "multiselect_question_id" UUID,
    "application_id" UUID NOT NULL,

    CONSTRAINT "application_lottery_positions_pkey" PRIMARY KEY ("listing_id","application_id")
);

-- AddForeignKey
ALTER TABLE "application_lottery_positions" ADD CONSTRAINT "application_lottery_positions_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_lottery_positions" ADD CONSTRAINT "application_lottery_positions_multiselect_question_id_fkey" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_lottery_positions" ADD CONSTRAINT "application_lottery_positions_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
