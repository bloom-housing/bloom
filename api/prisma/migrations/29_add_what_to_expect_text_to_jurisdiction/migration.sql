-- AlterTable
ALTER TABLE "jurisdictions" 
ADD COLUMN "what_to_expect" TEXT NOT NULL DEFAULT '',
ADD COLUMN "what_to_expect_additional_text" TEXT NOT NULL DEFAULT '',
ADD COLUMN "what_to_expect_under_construction" TEXT NOT NULL DEFAULT '';