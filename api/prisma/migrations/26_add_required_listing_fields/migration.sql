-- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN IF NOT EXISTS     "required_listing_fields" TEXT[] DEFAULT ARRAY[]::TEXT[];
