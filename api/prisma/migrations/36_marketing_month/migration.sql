-- CreateEnum
CREATE TYPE "month_enum" AS ENUM ('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december');

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "marketing_month" "month_enum";
