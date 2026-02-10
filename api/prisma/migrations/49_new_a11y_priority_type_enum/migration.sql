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

-- DropForeignKey
ALTER TABLE "unit_group" DROP CONSTRAINT "unit_group_priority_type_id_fkey";
ALTER TABLE "unit_group_snapshot" DROP CONSTRAINT IF EXISTS "unit_group_snapshot_priority_type_id_fkey";
ALTER TABLE "unit_snapshot" DROP CONSTRAINT "unit_snapshot_priority_type_id_fkey";
ALTER TABLE "units" DROP CONSTRAINT "units_priority_type_id_fkey";
ALTER TABLE "units_summary" DROP CONSTRAINT "units_summary_priority_type_id_fkey";
ALTER TABLE "units_summary_snapshot" DROP CONSTRAINT "units_summary_snapshot_priority_type_id_fkey";

-- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN     "visible_accessibility_priority_types" "unit_accessibility_priority_type_enum"[] DEFAULT ARRAY['mobility', 'hearing', 'vision', 'hearingAndVision', 'mobilityAndHearing', 'mobilityAndVision', 'mobilityHearingAndVision']::"unit_accessibility_priority_type_enum"[];

-- Add columns
ALTER TABLE "unit_group" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "unit_group_snapshot" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "units" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "unit_snapshot" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "units_summary" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";
ALTER TABLE "units_summary_snapshot" ADD COLUMN IF NOT EXISTS "accessibility_priority_type" "unit_accessibility_priority_type_enum";

-- Do migrations

-- Migrate legacy priority type ids to enum values (Units)

-- Migrate legacy priority type ids to enum values (Units Summary)

-- Migrate legacy priority type ids to enum values (Unit groups)

-- Migrate legacy priority type ids to enum values (Unit snapshots)

-- Migrate legacy priority type ids to enum values (Unit summary snapshots)

-- Migrate legacy priority type ids to enum values (Unit group snapshots)

-- Drop columns
ALTER TABLE "unit_group" DROP COLUMN "priority_type_id";
ALTER TABLE "unit_group_snapshot" DROP COLUMN "priority_type_id";
ALTER TABLE "unit_snapshot" DROP COLUMN "priority_type_id";
ALTER TABLE "units" DROP COLUMN "priority_type_id";
ALTER TABLE "units_summary" DROP COLUMN "priority_type_id";
ALTER TABLE "units_summary_snapshot" DROP COLUMN "priority_type_id";
DROP TABLE "unit_accessibility_priority_types";
