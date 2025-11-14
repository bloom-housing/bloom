ALTER TABLE "unit_group" 
ADD COLUMN "monthly_rent" DECIMAL,
ALTER COLUMN "flat_rent_value_from" SET DATA TYPE DECIMAL,
ALTER COLUMN "flat_rent_value_to" SET DATA TYPE DECIMAL;
