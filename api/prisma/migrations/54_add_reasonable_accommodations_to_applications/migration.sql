ALTER TABLE "applications"
ADD COLUMN "reasonable_accommodations" TEXT;

ALTER TABLE "application_snapshot"
ADD COLUMN "reasonable_accommodations" TEXT;
