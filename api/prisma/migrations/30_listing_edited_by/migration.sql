-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "last_updated_by_user_id" UUID;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_last_updated_by_user_id_fkey" FOREIGN KEY ("last_updated_by_user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
