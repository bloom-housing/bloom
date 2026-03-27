-- CreateEnum
CREATE TYPE "application_accessibility_feature_enum" AS ENUM (
  'hearing',
  'hearingAndVision',
  'mobility',
  'other',
  'vision'
);

-- AlterTable
ALTER TABLE "accessibility"
ADD COLUMN "hearing_and_vision" BOOLEAN;

-- AlterTable
ALTER TABLE "accessibility_snapshot"
ADD COLUMN "hearing_and_vision" BOOLEAN;

-- AlterTable
ALTER TABLE "jurisdictions"
ADD COLUMN "visible_application_accessibility_features" "application_accessibility_feature_enum"[] NOT NULL DEFAULT ARRAY['mobility', 'hearing', 'vision']::"application_accessibility_feature_enum"[];
