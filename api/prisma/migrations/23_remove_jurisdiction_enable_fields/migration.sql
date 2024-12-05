/*
 Warnings:
 
 - You are about to drop the column `enable_accessibility_features` on the `jurisdictions` table. All the data in the column will be lost.
 - You are about to drop the column `enable_utilities_included` on the `jurisdictions` table. All the data in the column will be lost.
 
 */
-- AlterTable
ALTER TABLE
  "jurisdictions" DROP COLUMN "enable_accessibility_features",
  DROP COLUMN "enable_utilities_included";