-- AlterTable
ALTER TABLE "listings"
    ALTER COLUMN "marketing_date" TYPE INTEGER
    USING EXTRACT(YEAR FROM "marketing_date");
ALTER TABLE "listings" RENAME "marketing_date" TO "marketing_year";
