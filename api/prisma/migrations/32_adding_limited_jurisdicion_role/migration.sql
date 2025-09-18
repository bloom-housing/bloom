-- AlterEnum
ALTER TYPE "user_role_enum" ADD VALUE 'limitedJurisdictionAdmin';

-- AlterTable
ALTER TABLE "user_roles" ADD COLUMN     "is_limited_jurisdictional_admin" BOOLEAN NOT NULL DEFAULT false;
