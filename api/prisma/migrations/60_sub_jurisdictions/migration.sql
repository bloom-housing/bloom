-- CreateTable
CREATE TABLE "_SubJurisdictions" ("A" UUID NOT NULL, "B" UUID NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "_SubJurisdictions_AB_unique" ON "_SubJurisdictions"("A", "B");

-- CreateIndex
CREATE INDEX "_SubJurisdictions_B_index" ON "_SubJurisdictions"("B");

-- AddForeignKey
ALTER TABLE
    "_SubJurisdictions"
ADD
    CONSTRAINT "_SubJurisdictions_A_fkey" FOREIGN KEY ("A") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "_SubJurisdictions"
ADD
    CONSTRAINT "_SubJurisdictions_B_fkey" FOREIGN KEY ("B") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;