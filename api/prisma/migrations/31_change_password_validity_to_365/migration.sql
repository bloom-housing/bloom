-- AlterTable
ALTER TABLE "user_accounts" ALTER COLUMN "password_valid_for_days" SET DEFAULT 365;
-- Update existing rows
UPDATE "user_accounts" SET "password_valid_for_days" = 365
