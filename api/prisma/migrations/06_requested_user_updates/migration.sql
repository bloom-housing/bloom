-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_requested_changes_user_id_fkey" FOREIGN KEY ("requested_changes_user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
