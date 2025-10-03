-- AlterEnum
ALTER TYPE "user_role_enum" ADD VALUE 'supportAdmin';


-- AlterTable
ALTER TABLE "user_roles" ADD COLUMN     "is_support_admin" BOOLEAN NOT NULL DEFAULT false;
