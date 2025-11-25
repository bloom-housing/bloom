-- CreateEnum
CREATE TYPE "listing_type_enum" AS ENUM ('regulated', 'nonRegulated');

-- CreateEnum
CREATE TYPE "deposit_type_enum" AS ENUM ('fixedDeposit', 'depositRange');

-- CreateEnum
CREATE TYPE "rent_type_enum" AS ENUM ('fixedRent', 'rentRange');

-- AlterTable
ALTER TABLE "listings" 
ADD COLUMN     "coc_info" TEXT,
ADD COLUMN     "deposit_type" "deposit_type_enum",
ADD COLUMN     "deposit_value" DECIMAL(65,30),
ADD COLUMN     "has_hud_ebll_clearance" BOOLEAN,
ADD COLUMN     "listing_type" "listing_type_enum" DEFAULT 'regulated';

-- AlterTable
ALTER TABLE "unit_group" ADD COLUMN     "flat_rent_value_from" DECIMAL(65,30),
ADD COLUMN     "flat_rent_value_to" DECIMAL(65,30),
ADD COLUMN     "rent_type" "rent_type_enum";
