-- AlterTable
ALTER TABLE
    "user_roles"
ADD
    COLUMN "is_super_admin" BOOLEAN NOT NULL DEFAULT false;