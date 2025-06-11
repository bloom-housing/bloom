-- CreateIndex (only if it doesn't exist)

CREATE INDEX IF NOT EXISTS "applications_user_id_idx" ON "applications"("user_id");
