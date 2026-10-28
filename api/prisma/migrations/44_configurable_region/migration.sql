-- -- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN "regions" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "listings" ADD COLUMN "configurable_region" TEXT;