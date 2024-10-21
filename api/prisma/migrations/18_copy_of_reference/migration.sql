-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "copy_of_id" UUID;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_copy_of_id_fkey" FOREIGN KEY ("copy_of_id") REFERENCES "listings"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
