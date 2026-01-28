-- AlterTable
ALTER TABLE "user_accounts" 
ADD COLUMN     "additional_phone_extension" TEXT,
ADD COLUMN     "additional_phone_number" TEXT,
ADD COLUMN     "additional_phone_number_type" TEXT,
ADD COLUMN     "address_id" UUID,
ADD COLUMN     "agency_id" UUID,
ADD COLUMN     "is_advocate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_extension" TEXT,
ADD COLUMN     "phone_type" TEXT,
ADD COLUMN     "title" TEXT;

-- AddForeignKey
ALTER TABLE "user_accounts" 
ADD CONSTRAINT "user_accounts_address_id_fkey" 
FOREIGN KEY ("address_id") 
REFERENCES "address"("id") 
ON DELETE NO ACTION 
ON UPDATE NO ACTION ;

-- AddForeignKey
ALTER TABLE "user_accounts" 
ADD CONSTRAINT "user_accounts_agency_id_fkey" 
FOREIGN KEY ("agency_id") 
REFERENCES "agency"("id") 
ON DELETE NO ACTION 
ON UPDATE NO ACTION ;
