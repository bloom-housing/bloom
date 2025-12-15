-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "accessible_marketing_flyer" TEXT,
ADD COLUMN     "accessible_marketing_flyer_file_id" UUID,
ADD COLUMN     "marketing_flyer" TEXT,
ADD COLUMN     "marketing_flyer_file_id" UUID;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_marketing_flyer_file_id_fkey" FOREIGN KEY ("marketing_flyer_file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_accessible_marketing_flyer_file_id_fkey" FOREIGN KEY ("accessible_marketing_flyer_file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
