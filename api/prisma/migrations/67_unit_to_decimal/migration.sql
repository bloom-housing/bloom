-- Drop views to avoid dependency issues before altering the tables 
-- These views are no longer needed in the new API
DROP VIEW IF EXISTS "combined_listings";
DROP VIEW IF EXISTS "combined_listings_units";

-- AlterTable
-- Convert all existing monthly_rent values to decimal. If there are non-numeric values, they will be converted to NULL.
ALTER TABLE
  "units"
ALTER COLUMN
  "monthly_rent" TYPE DECIMAL(8, 2) USING NULLIF(TRIM("monthly_rent"), '') :: DECIMAL(8, 2);

-- AlterTable
-- Convert all existing monthly_rent values to decimal. If there are non-numeric values, they will be converted to NULL.
ALTER TABLE
  "unit_snapshot"
ALTER COLUMN
  "monthly_rent" TYPE DECIMAL(8, 2) USING NULLIF(TRIM("monthly_rent"), '') :: DECIMAL(8, 2);