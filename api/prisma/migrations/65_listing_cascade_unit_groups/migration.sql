-- DropForeignKey
ALTER TABLE "unit_group" DROP CONSTRAINT "unit_group_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "unit_group_ami_levels" DROP CONSTRAINT "unit_group_ami_levels_unit_group_id_fkey";

-- AlterTable
ALTER TABLE "application_snapshot" ALTER COLUMN "income_vouchers" DROP DEFAULT;

-- AlterTable
ALTER TABLE "applications" ALTER COLUMN "income_vouchers" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_notification_preferences" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_notification_preferences_snapshot" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "unit_group" ADD CONSTRAINT "unit_group_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "unit_group_ami_levels_unit_group_id_fkey" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
