-- AlterTable

ALTER TABLE "user_accounts" ADD COLUMN     "ai_consent_given_at" TIMESTAMPTZ(6),
ADD COLUMN     "has_consented_to_ai" BOOLEAN DEFAULT false;
