-- DropForeignKey

ALTER TABLE "application_methods"
DROP CONSTRAINT "application_methods_listing_id_fkey";

-- AddForeignKey

ALTER TABLE "application_methods" ADD CONSTRAINT "application_methods_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- DropForeignKey

ALTER TABLE "applications"
DROP CONSTRAINT "applications_listing_id_fkey";

-- AddForeignKey

ALTER TABLE "applications" ADD CONSTRAINT "applications_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON
DELETE
SET NULL ON
UPDATE NO ACTION;

-- DropForeignKey

ALTER TABLE "listing_images"
DROP CONSTRAINT "listing_images_listing_id_fkey";

-- AddForeignKey

ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- DropForeignKey

ALTER TABLE "listing_events"
DROP CONSTRAINT "listing_events_listing_id_fkey";

-- AddForeignKey

ALTER TABLE "listing_events" ADD CONSTRAINT "listing_events_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- DropForeignKey

ALTER TABLE "listing_multiselect_questions"
DROP CONSTRAINT "listing_multiselect_questions_listing_id_fkey";

-- AddForeignKey

ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "listing_multiselect_questions_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- DropForeignKey

ALTER TABLE "units_summary"
DROP CONSTRAINT "units_summary_listing_id_fkey";

-- AddForeignKey

ALTER TABLE "units_summary" ADD CONSTRAINT "units_summary_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- DropForeignKey

ALTER TABLE "application_flagged_set"
DROP CONSTRAINT "application_flagged_set_listing_id_fkey";

-- AddForeignKey

ALTER TABLE "application_flagged_set" ADD CONSTRAINT "application_flagged_set_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

-- DropForeignKey

ALTER TABLE "paper_applications"
DROP CONSTRAINT "paper_applications_application_method_id_fkey";

-- AddForeignKey

ALTER TABLE "paper_applications" ADD CONSTRAINT "paper_applications_application_method_id_fkey"
FOREIGN KEY ("application_method_id") REFERENCES "application_methods"("id") ON
DELETE
SET NULL ON
UPDATE NO ACTION;

-- DropForeignKey

ALTER TABLE "household_member"
DROP CONSTRAINT "household_member_application_id_fkey";

-- AddForeignKey

ALTER TABLE "household_member" ADD CONSTRAINT "household_member_application_id_fkey"
FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON
DELETE CASCADE ON
UPDATE NO ACTION;

