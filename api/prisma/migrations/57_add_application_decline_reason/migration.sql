-- CreateEnum
CREATE TYPE "application_decline_reason_enum" AS ENUM (
  'ageRestriction',
  'incomeRestriction',
  'unitRestriction',
  'programRestriction',
  'attemptedToContactNoResponse',
  'householdDoesNotNeedAccessibleUnit',
  'other'
);

-- AlterTable
ALTER TABLE "applications"
ADD COLUMN "application_decline_reason" "application_decline_reason_enum",
ADD COLUMN "application_decline_reason_additional_details" TEXT;

-- AlterTable
ALTER TABLE "application_snapshot"
ADD COLUMN "application_decline_reason" "application_decline_reason_enum",
ADD COLUMN "application_decline_reason_additional_details" TEXT;
