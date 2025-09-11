-- CreateEnum
CREATE TYPE "multiselect_questions_status_enum" AS ENUM ('draft', 'visibl', 'active', 'toRetire', 'retired');

-- CreateEnum
CREATE TYPE "validation_method_enum" AS ENUM ('radius', 'map', 'none');

-- AlterTable
ALTER TABLE "multiselect_questions" ADD COLUMN "is_exclusive" BOOLEAN;
ALTER TABLE "multiselect_questions" ADD COLUMN "jurisdiction_id" UUID;
ALTER TABLE "multiselect_questions" ADD COLUMN "name" TEXT;
ALTER TABLE "multiselect_questions" ADD COLUMN "status" "multiselect_questions_status_enum" NOT NULL DEFAULT 'draft';

UPDATE "multiselect_questions"
SET "name" = "text";

ALTER TABLE "multiselect_questions" ALTER COLUMN "name" SET NOT NULL;

UPDATE "multiselect_questions"
SET "is_exclusive" = FALSE;

ALTER TABLE "multiselect_questions" ALTER COLUMN "is_exclusive" SET NOT NULL;

-- Switching from allowing multiple jurisdictions for MSQ to only one. Requires us to move the association into a new field. In practice only one has ever been assigned.
UPDATE "multiselect_questions" mq
SET "jurisdiction_id" = (
    SELECT "A"
    FROM "_JurisdictionsToMultiselectQuestions" jmq
    WHERE jmq."B" = mq.id 
    LIMIT 1
);

ALTER TABLE "multiselect_questions" ALTER COLUMN "jurisdiction_id" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "_JurisdictionsToMultiselectQuestions" DROP CONSTRAINT "_JurisdictionsToMultiselectQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_JurisdictionsToMultiselectQuestions" DROP CONSTRAINT "_JurisdictionsToMultiselectQuestions_B_fkey";

-- DropTable
DROP TABLE "_JurisdictionsToMultiselectQuestions";

-- CreateTable
CREATE TABLE "ApplicationSelectionOptions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "address_holder_address_id" UUID,
    "address_holder_name" TEXT,
    "address_holder_relationship" TEXT,
    "application_selection_id" UUID NOT NULL,
    "is_geocoding_verified" BOOLEAN,
    "multiselect_option_id" UUID NOT NULL,

    CONSTRAINT "ApplicationSelectionOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationSelections" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "application_id" UUID NOT NULL,
    "has_opted_out" BOOLEAN,
    "multiselect_question_id" UUID NOT NULL,

    CONSTRAINT "ApplicationSelections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multiselect_options" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "description" TEXT,
    "is_opt_out" BOOLEAN NOT NULL DEFAULT FALSE,
    "links" JSONB,
    "map_layer_id" TEXT,
    "map_pin_position" TEXT,
    "multiselect_question_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "radius_size" INTEGER,
    "should_collect_address" BOOLEAN,
    "should_collect_name" BOOLEAN,
    "should_collect_relationship" BOOLEAN,
    "validation_method" "validation_method_enum",

    CONSTRAINT "multiselect_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationSelectionOptions_address_holder_address_id_key" ON "ApplicationSelectionOptions"("address_holder_address_id");

-- AddForeignKey
ALTER TABLE "ApplicationSelectionOptions" ADD CONSTRAINT "ApplicationSelectionOptions_address_holder_address_id_fkey" FOREIGN KEY ("address_holder_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ApplicationSelectionOptions" ADD CONSTRAINT "ApplicationSelectionOptions_application_selection_id_fkey" FOREIGN KEY ("application_selection_id") REFERENCES "ApplicationSelections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ApplicationSelectionOptions" ADD CONSTRAINT "ApplicationSelectionOptions_multiselect_option_id_fkey" FOREIGN KEY ("multiselect_option_id") REFERENCES "multiselect_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ApplicationSelections" ADD CONSTRAINT "ApplicationSelections_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ApplicationSelections" ADD CONSTRAINT "ApplicationSelections_multiselect_question_id_fkey" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "multiselect_options" ADD CONSTRAINT "multiselect_options_multiselect_question_id_fkey" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "multiselect_questions" ADD CONSTRAINT "multiselect_questions_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
