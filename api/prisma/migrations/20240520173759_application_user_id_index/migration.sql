-- CreateIndex

CREATE INDEX "applications_user_id_idx" ON "applications"("user_id") WITH (deduplicate_items = off);

