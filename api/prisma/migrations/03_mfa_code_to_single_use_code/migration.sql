-- AlterTable

ALTER TABLE "user_accounts" RENAME COLUMN "mfa_code" TO "single_use_code";


ALTER TABLE "user_accounts" RENAME COLUMN "mfa_code_updated_at" TO "single_use_code_updated_at";

