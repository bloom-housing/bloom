-- DropForeignKey
ALTER TABLE "application_selection_options" DROP CONSTRAINT "application_selection_options_application_selection_id_fkey";

-- DropForeignKey
ALTER TABLE "application_selections" DROP CONSTRAINT "application_selections_application_id_fkey";

-- AddForeignKey
ALTER TABLE "application_selection_options" ADD CONSTRAINT "application_selection_options_application_selection_id_fkey" FOREIGN KEY ("application_selection_id") REFERENCES "application_selections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selections" ADD CONSTRAINT "application_selections_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
