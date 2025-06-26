-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "was_created_externally" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "was_created_externally" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "multiselect_questions" ADD COLUMN     "was_created_externally" BOOLEAN NOT NULL DEFAULT false;
