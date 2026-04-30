-- CreateEnum
CREATE TYPE "application_decline_reason_enum" AS ENUM ('doesNotQualify', 'incomeDoesNotQualify', 'householdSizeDoesNotQualify', 'applicationSubmittedAfterDeadline', 'other');

-- AlterTable
ALTER TABLE "applications"
ADD COLUMN "application_decline_reason" "application_decline_reason_enum";

-- AlterTable
ALTER TABLE "application_snapshot"
ADD COLUMN "application_decline_reason" "application_decline_reason_enum";
