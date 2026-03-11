-- DropForeignKey
ALTER TABLE "_ListingSnapshotToUserAccountSnapshot" DROP CONSTRAINT "_ListingSnapshotToUserAccountSnapshot_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListingSnapshotToUserAccountSnapshot" DROP CONSTRAINT "_ListingSnapshotToUserAccountSnapshot_B_fkey";

-- DropTable
DROP TABLE "_ListingSnapshotToUserAccountSnapshot";

-- CreateTable
CREATE TABLE "_ListingsToUserAccountSnapshot" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ListingsToUserAccountSnapshot_AB_unique" ON "_ListingsToUserAccountSnapshot"("A", "B");

-- CreateIndex
CREATE INDEX "_ListingsToUserAccountSnapshot_B_index" ON "_ListingsToUserAccountSnapshot"("B");

-- AddForeignKey
ALTER TABLE "_ListingsToUserAccountSnapshot" ADD CONSTRAINT "_ListingsToUserAccountSnapshot_A_fkey" FOREIGN KEY ("A") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingsToUserAccountSnapshot" ADD CONSTRAINT "_ListingsToUserAccountSnapshot_B_fkey" FOREIGN KEY ("B") REFERENCES "user_account_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropIndex
DROP INDEX "user_account_snapshot_email_key";