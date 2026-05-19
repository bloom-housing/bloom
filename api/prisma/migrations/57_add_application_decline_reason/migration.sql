-- CreateEnum
CREATE TYPE "application_decline_reason_enum" AS ENUM (
  'householdIncomeTooHigh',
  'householdIncomeTooLow',
  'householdSizeTooLarge',
  'householdSizeTooSmall',
  'attemptedToContactNoResponse',
  'applicantDeclinedUnit',
  'doesNotMeetSeniorBuildingRequirement',
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
