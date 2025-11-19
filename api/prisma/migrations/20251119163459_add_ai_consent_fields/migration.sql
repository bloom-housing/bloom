/*
  Warnings:

  - You are about to alter the column `deposit_value` on the `listings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(8,2)`.
  - Made the column `listing_type` on table `listings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "listings" ALTER COLUMN "deposit_value" SET DATA TYPE DECIMAL(8,2),
ALTER COLUMN "listing_type" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_accounts" ADD COLUMN     "ai_consent_given_at" TIMESTAMPTZ(6),
ADD COLUMN     "has_consented_to_ai" BOOLEAN DEFAULT false;
