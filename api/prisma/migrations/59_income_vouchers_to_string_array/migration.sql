-- AlterTable: change income_vouchers from boolean to text array

ALTER TABLE "applications"
ADD COLUMN "income_vouchers_new" TEXT[] NOT NULL DEFAULT '{}';

-- Migrate existing true values to ['incomeVoucher'], false/null to empty array
UPDATE "applications"
SET "income_vouchers_new" = ARRAY['incomeVoucher']
WHERE "income_vouchers" = true;

ALTER TABLE "applications"
DROP COLUMN "income_vouchers";

ALTER TABLE "applications"
RENAME COLUMN "income_vouchers_new" TO "income_vouchers";

-- AlterTable: change income_vouchers from boolean to text array on snapshot table
ALTER TABLE "application_snapshot"
ADD COLUMN "income_vouchers_new" TEXT[] NOT NULL DEFAULT '{}';

-- Migrate existing true values to ['incomeVoucher'], false/null to empty array
UPDATE "application_snapshot"
SET "income_vouchers_new" = ARRAY['incomeVoucher']
WHERE "income_vouchers" = true;

ALTER TABLE "application_snapshot"
DROP COLUMN "income_vouchers";

ALTER TABLE "application_snapshot"
RENAME COLUMN "income_vouchers_new" TO "income_vouchers";
