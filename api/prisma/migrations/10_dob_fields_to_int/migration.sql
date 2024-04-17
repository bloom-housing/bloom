/*
  converts `birth_month`, `birth_day`, `birth_year` columns from strings to integers for the "applicant" and "household_member" tables
*/

-- AlterTable applicant
ALTER TABLE "applicant" ADD COLUMN "birth_year_temp" INTEGER;
ALTER TABLE "applicant" ADD COLUMN "birth_month_temp" INTEGER;
ALTER TABLE "applicant" ADD COLUMN "birth_day_temp" INTEGER;

UPDATE "applicant" SET 
  "birth_year_temp" = CASE WHEN "birth_year" = NULL THEN NULL ELSE "birth_year" :: Integer END,
  "birth_month_temp" = CASE WHEN "birth_month" = NULL THEN NULL ELSE "birth_month" :: Integer END,
  "birth_day_temp" = CASE WHEN "birth_day" = NULL THEN NULL ELSE "birth_day" :: Integer END;

ALTER TABLE "applicant" DROP COLUMN "birth_year";
ALTER TABLE "applicant" DROP COLUMN "birth_month";
ALTER TABLE "applicant" DROP COLUMN "birth_day";

ALTER TABLE "applicant" ADD COLUMN "birth_year" INTEGER;
ALTER TABLE "applicant" ADD COLUMN "birth_month" INTEGER;
ALTER TABLE "applicant" ADD COLUMN "birth_day" INTEGER;

UPDATE "applicant" SET 
  "birth_year" = "birth_year_temp",
  "birth_month" = "birth_month_temp",
  "birth_day" = "birth_day_temp",
  "first_name" = TRIM("first_name"),
  "last_name" = TRIM("last_name");

ALTER TABLE "applicant" DROP COLUMN "birth_year_temp";
ALTER TABLE "applicant" DROP COLUMN "birth_month_temp";
ALTER TABLE "applicant" DROP COLUMN "birth_day_temp";

-- AlterTable household_member
ALTER TABLE "household_member" ADD COLUMN "birth_year_temp" INTEGER;
ALTER TABLE "household_member" ADD COLUMN "birth_month_temp" INTEGER;
ALTER TABLE "household_member" ADD COLUMN "birth_day_temp" INTEGER;

UPDATE "household_member" SET 
  "birth_year_temp" = CASE WHEN "birth_year" = NULL THEN NULL ELSE "birth_year" :: Integer END,
  "birth_month_temp" = CASE WHEN "birth_month" = NULL THEN NULL ELSE "birth_month" :: Integer END,
  "birth_day_temp" = CASE WHEN "birth_day" = NULL THEN NULL ELSE "birth_day" :: Integer END;

ALTER TABLE "household_member" DROP COLUMN "birth_year";
ALTER TABLE "household_member" DROP COLUMN "birth_month";
ALTER TABLE "household_member" DROP COLUMN "birth_day";

ALTER TABLE "household_member" ADD COLUMN "birth_year" INTEGER;
ALTER TABLE "household_member" ADD COLUMN "birth_month" INTEGER;
ALTER TABLE "household_member" ADD COLUMN "birth_day" INTEGER;

UPDATE "household_member" SET 
  "birth_year" = "birth_year_temp",
  "birth_month" = "birth_month_temp",
  "birth_day" = "birth_day_temp",
  "first_name" = TRIM("first_name"),
  "last_name" = TRIM("last_name");

ALTER TABLE "household_member" DROP COLUMN "birth_year_temp";
ALTER TABLE "household_member" DROP COLUMN "birth_month_temp";
ALTER TABLE "household_member" DROP COLUMN "birth_day_temp";


