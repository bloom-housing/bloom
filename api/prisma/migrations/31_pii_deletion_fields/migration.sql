-- AlterTable
ALTER TABLE
    "applications"
ADD
    COLUMN "expire_after" TIMESTAMP(3),
ADD
    COLUMN "is_newest" BOOLEAN DEFAULT false,
ADD
    COLUMN "was_pii_cleared" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE
    "user_accounts"
ADD
    COLUMN "was_warned_of_deletion" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE INDEX "applications_is_newest_idx" ON "applications"("is_newest");

-- CreateIndex
CREATE INDEX "applications_was_pii_cleared_idx" ON "applications"("was_pii_cleared");

-- CreateIndex
CREATE INDEX "applications_expire_after_idx" ON "applications"("expire_after");

-- CreateIndex
CREATE INDEX "user_accounts_last_login_at_idx" ON "user_accounts"("last_login_at");

-- CreateIndex
CREATE INDEX "user_accounts_was_warned_of_deletion_idx" ON "user_accounts"("was_warned_of_deletion");