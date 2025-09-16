-- AlterTable
ALTER TABLE
    "applications"
ADD
    COLUMN "expire_after" TIMESTAMP(6),
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
