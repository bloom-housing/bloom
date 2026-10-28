-- AlterTable
ALTER TABLE "user_account_snapshot" ADD COLUMN     "additional_phone_extension" TEXT,
ADD COLUMN     "additional_phone_number" TEXT,
ADD COLUMN     "additional_phone_number_type" TEXT,
ADD COLUMN     "address_snapshot_id" UUID,
ADD COLUMN     "agency_id" UUID,
ADD COLUMN     "is_advocate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_extension" TEXT,
ADD COLUMN     "phone_type" TEXT,
ADD COLUMN     "title" TEXT;

-- AddForeignKey
ALTER TABLE "user_account_snapshot" ADD CONSTRAINT "user_account_snapshot_address_snapshot_id_fkey" FOREIGN KEY ("address_snapshot_id") REFERENCES "address_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_account_snapshot" ADD CONSTRAINT "user_account_snapshot_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
