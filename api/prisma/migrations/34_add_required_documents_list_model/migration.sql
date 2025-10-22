-- AlterTable
ALTER TABLE "listings" ADD COLUMN "documents_id" UUID;

-- CreateTable
CREATE TABLE "listing_documents" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "socialSecurityCard" BOOLEAN,
    "currentLandlordReference" BOOLEAN,
    "birthCertificate" BOOLEAN,
    "previousLandlordReference" BOOLEAN,
    "governmentIssuedId" BOOLEAN,
    "proofOfAssets" BOOLEAN,
    "proofOfIncome" BOOLEAN,
    "residencyDocuments" BOOLEAN,
    "proofOfCustody" BOOLEAN,

    CONSTRAINT "listing_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listings_documents_id_key" ON "listings"("documents_id");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_documents_id_fkey" FOREIGN KEY ("documents_id") REFERENCES "listing_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
