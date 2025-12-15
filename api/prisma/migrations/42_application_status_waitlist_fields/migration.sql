/*
  Warnings:

  - The values [draft,removed] on the enum `application_status_enum` will be removed. If these variants are still used in the database, this will fail.
*/
-- AlterEnum
BEGIN;
CREATE TYPE "application_status_enum_new" AS ENUM ('submitted', 'declined', 'receivedUnit', 'waitlist', 'waitlistDeclined');
ALTER TABLE "applications" ALTER COLUMN "status" TYPE "application_status_enum_new" USING ("status"::text::"application_status_enum_new");
ALTER TYPE "application_status_enum" RENAME TO "application_status_enum_old";
ALTER TYPE "application_status_enum_new" RENAME TO "application_status_enum";
DROP TYPE "application_status_enum_old";
COMMIT;

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "accessible_unit_waitlist_number" INTEGER,
ADD COLUMN     "conventional_unit_waitlist_number" INTEGER,
ADD COLUMN     "manual_lottery_position_number" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'submitted';