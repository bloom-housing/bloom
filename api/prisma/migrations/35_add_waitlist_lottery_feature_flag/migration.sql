/*
  Warnings:

  - The values [waitlist] on the enum `listings_review_order_type_enum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `deposit_value` on the `listings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(8,2)`.
  - Made the column `listing_type` on table `listings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "listings_review_order_type_enum_new" AS ENUM ('lottery', 'firstComeFirstServe', 'waitlistFCFS');
ALTER TABLE "listings" ALTER COLUMN "review_order_type" TYPE "listings_review_order_type_enum_new" USING ("review_order_type"::text::"listings_review_order_type_enum_new");
ALTER TYPE "listings_review_order_type_enum" RENAME TO "listings_review_order_type_enum_old";
ALTER TYPE "listings_review_order_type_enum_new" RENAME TO "listings_review_order_type_enum";
DROP TYPE "listings_review_order_type_enum_old";
COMMIT;
