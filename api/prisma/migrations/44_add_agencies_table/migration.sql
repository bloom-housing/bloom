CREATE TABLE "agency" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" TEXT NOT NULL,
    "jurisdictions_id" UUID,

    CONSTRAINT "agency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "agency" 
ADD CONSTRAINT "agency_jurisdictions_id_fkey" 
FOREIGN KEY ("jurisdictions_id") 
REFERENCES "jurisdictions"("id") 
ON DELETE NO ACTION 
ON UPDATE NO ACTION;
