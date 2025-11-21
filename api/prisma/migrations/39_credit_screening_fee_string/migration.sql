ALTER TABLE "listings"
  DROP COLUMN "credit_screening_fee";

ALTER TABLE "listings"
  RENAME COLUMN "credit_screening_fee_amount" TO "credit_screening_fee";


