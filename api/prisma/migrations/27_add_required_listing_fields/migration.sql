-- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN     "required_listing_fields" TEXT[] DEFAULT ARRAY[]::TEXT[];
