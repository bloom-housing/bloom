-- AlterEnum
BEGIN;
CREATE TYPE "multiselect_questions_status_enum_new" AS ENUM ('draft', 'visible', 'active', 'toRetire', 'retired');
ALTER TABLE "multiselect_questions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "multiselect_questions" ALTER COLUMN "status" TYPE "multiselect_questions_status_enum_new" USING ("status"::text::"multiselect_questions_status_enum_new");
ALTER TYPE "multiselect_questions_status_enum" RENAME TO "multiselect_questions_status_enum_old";
ALTER TYPE "multiselect_questions_status_enum_new" RENAME TO "multiselect_questions_status_enum";
DROP TYPE "multiselect_questions_status_enum_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ApplicationSelectionOptions" DROP CONSTRAINT "ApplicationSelectionOptions_address_holder_address_id_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationSelectionOptions" DROP CONSTRAINT "ApplicationSelectionOptions_application_selection_id_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationSelectionOptions" DROP CONSTRAINT "ApplicationSelectionOptions_multiselect_option_id_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationSelections" DROP CONSTRAINT "ApplicationSelections_application_id_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationSelections" DROP CONSTRAINT "ApplicationSelections_multiselect_question_id_fkey";

-- AlterTable
ALTER TABLE "multiselect_questions" ALTER COLUMN "status" SET DEFAULT 'draft';

-- DropTable
DROP TABLE "ApplicationSelectionOptions";

-- DropTable
DROP TABLE "ApplicationSelections";

-- CreateTable
CREATE TABLE "application_selection_options" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "address_holder_address_id" UUID,
    "address_holder_name" TEXT,
    "address_holder_relationship" TEXT,
    "application_selection_id" UUID NOT NULL,
    "is_geocoding_verified" BOOLEAN,
    "multiselect_option_id" UUID NOT NULL,

    CONSTRAINT "application_selection_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_selections" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "application_id" UUID NOT NULL,
    "has_opted_out" BOOLEAN,
    "multiselect_question_id" UUID NOT NULL,

    CONSTRAINT "application_selections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_selection_options_address_holder_address_id_key" ON "application_selection_options"("address_holder_address_id");

-- AddForeignKey
ALTER TABLE "application_selection_options" ADD CONSTRAINT "application_selection_options_address_holder_address_id_fkey" FOREIGN KEY ("address_holder_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selection_options" ADD CONSTRAINT "application_selection_options_application_selection_id_fkey" FOREIGN KEY ("application_selection_id") REFERENCES "application_selections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selection_options" ADD CONSTRAINT "application_selection_options_multiselect_option_id_fkey" FOREIGN KEY ("multiselect_option_id") REFERENCES "multiselect_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selections" ADD CONSTRAINT "application_selections_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_selections" ADD CONSTRAINT "application_selections_multiselect_question_id_fkey" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
