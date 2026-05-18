-- AlterTable
ALTER TABLE
    "jurisdictions"
ADD
    COLUMN "sub_jurisdictions" TEXT [] DEFAULT ARRAY [] :: TEXT [];