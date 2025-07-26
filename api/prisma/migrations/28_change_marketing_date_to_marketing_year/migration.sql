/*
  Warnings:

  - You are about to change column `marketing_date` on the `listings` table. All the data in the column will be transformed to year only.

*/
-- AlterTable
ALTER TABLE "listings"
    ALTER COLUMN "marketing_date" TYPE INTEGER
    USING EXTRACT(YEAR FROM "marketing_date");
ALTER TABLE "listings" RENAME "marketing_date" TO "marketing_year";
