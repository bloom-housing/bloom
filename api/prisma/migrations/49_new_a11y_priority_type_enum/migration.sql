/*
  Warnings:

  - You are about to drop the column `priority_type_id` on the `unit_group` table. All the data in the column will be lost.
  - You are about to drop the column `priority_type_id` on the `unit_group_snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `priority_type_id` on the `unit_snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `priority_type_id` on the `units` table. All the data in the column will be lost.
  - You are about to drop the column `priority_type_id` on the `units_summary` table. All the data in the column will be lost.
  - You are about to drop the column `priority_type_id` on the `units_summary_snapshot` table. All the data in the column will be lost.
  - You are about to drop the `unit_accessibility_priority_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "unit_accessibility_priority_type_enum" AS ENUM ('mobility', 'hearing', 'vision', 'hearingAndVision', 'mobilityAndHearing', 'mobilityAndVision', 'mobilityHearingAndVision');

-- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN     "visible_accessibility_priority_types" "unit_accessibility_priority_type_enum"[] DEFAULT ARRAY['mobility', 'hearing', 'vision', 'hearingAndVision', 'mobilityAndHearing', 'mobilityAndVision', 'mobilityHearingAndVision']::"unit_accessibility_priority_type_enum"[];

-- Add columns
ALTER TABLE "unit_group" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "unit_group_snapshot" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "units" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "unit_snapshot" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "units_summary" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "units_summary_snapshot" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";

-- Create temporary mapping table
CREATE TEMP TABLE priority_type_mapping AS
SELECT 
  id,
  CASE
    WHEN replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%mobility%' 
      AND replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%hearing%' 
      AND replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%vision%' 
      THEN 'mobilityHearingAndVision'::"unit_accessibility_priority_type_enum"
    WHEN replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%mobility%' 
      AND replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%hearing%' 
      THEN 'mobilityAndHearing'::"unit_accessibility_priority_type_enum"
    WHEN replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%mobility%' 
      AND replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%vision%' 
      THEN 'mobilityAndVision'::"unit_accessibility_priority_type_enum"
    WHEN replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%hearing%' 
      AND replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%vision%' 
      THEN 'hearingAndVision'::"unit_accessibility_priority_type_enum"
    WHEN replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%mobility%' 
      THEN 'mobility'::"unit_accessibility_priority_type_enum"
    WHEN replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%hearing%' 
      THEN 'hearing'::"unit_accessibility_priority_type_enum"
    WHEN replace(regexp_replace(replace(lower("name"), '&', 'and'), '[^a-z]', '', 'g'), 'visual', 'vision') LIKE '%vision%' 
      THEN 'vision'::"unit_accessibility_priority_type_enum"
    ELSE NULL
  END AS enum_value
FROM "unit_accessibility_priority_types";

-- Migrate all tables using the mapping
UPDATE "units" SET "accessibility_priority_type" = m.enum_value
FROM priority_type_mapping m
WHERE "priority_type_id" = m.id AND "priority_type_id" IS NOT NULL;

UPDATE "units_summary" SET "accessibility_priority_type" = m.enum_value
FROM priority_type_mapping m
WHERE "priority_type_id" = m.id AND "priority_type_id" IS NOT NULL;

UPDATE "unit_group" SET "accessibility_priority_type" = m.enum_value
FROM priority_type_mapping m
WHERE "priority_type_id" = m.id AND "priority_type_id" IS NOT NULL;

UPDATE "unit_snapshot" SET "accessibility_priority_type" = m.enum_value
FROM priority_type_mapping m
WHERE "priority_type_id" = m.id AND "priority_type_id" IS NOT NULL;

UPDATE "units_summary_snapshot" SET "accessibility_priority_type" = m.enum_value
FROM priority_type_mapping m
WHERE "priority_type_id" = m.id AND "priority_type_id" IS NOT NULL;

UPDATE "unit_group_snapshot" SET "accessibility_priority_type" = m.enum_value
FROM priority_type_mapping m
WHERE "priority_type_id" = m.id AND "priority_type_id" IS NOT NULL;

-- Drop the temporary mapping table
DROP TABLE priority_type_mapping;

-- DropForeignKey
ALTER TABLE "unit_group" DROP CONSTRAINT "unit_group_priority_type_id_fkey";
ALTER TABLE "unit_group_snapshot" DROP CONSTRAINT IF EXISTS "unit_group_snapshot_priority_type_id_fkey";
ALTER TABLE "unit_snapshot" DROP CONSTRAINT "unit_snapshot_priority_type_id_fkey";
ALTER TABLE "units" DROP CONSTRAINT "units_priority_type_id_fkey";
ALTER TABLE "units_summary" DROP CONSTRAINT "units_summary_priority_type_id_fkey";
ALTER TABLE "units_summary_snapshot" DROP CONSTRAINT "units_summary_snapshot_priority_type_id_fkey";

-- Drop columns
ALTER TABLE "unit_group" DROP COLUMN "priority_type_id";
ALTER TABLE "unit_group_snapshot" DROP COLUMN "priority_type_id";
ALTER TABLE "unit_snapshot" DROP COLUMN "priority_type_id";
ALTER TABLE "units" DROP COLUMN "priority_type_id";
ALTER TABLE "units_summary" DROP COLUMN "priority_type_id";
ALTER TABLE "units_summary_snapshot" DROP COLUMN "priority_type_id";
DROP TABLE "unit_accessibility_priority_types";
