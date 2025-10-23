-- AlterEnum
ALTER TYPE "user_role_enum" ADD VALUE IF NOT EXISTS 'limitedJurisdictionAdmin';

-- AlterTable
ALTER TABLE "user_roles" ADD COLUMN IF NOT EXISTS "is_limited_jurisdictional_admin" BOOLEAN NOT NULL DEFAULT false;
