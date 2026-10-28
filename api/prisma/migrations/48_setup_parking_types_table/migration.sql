-- AlterTable
ALTER TABLE "listings" 
ADD COLUMN "parking_type_id" UUID;

-- CreateTable
CREATE TABLE "listing_parking_type" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "on_street" BOOLEAN,
    "off_street" BOOLEAN,
    "garage" BOOLEAN,
    "carport" BOOLEAN,

    CONSTRAINT "listing_parking_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listings_parking_type_id_key" ON "listings"("parking_type_id");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_parking_type_id_fkey" FOREIGN KEY ("parking_type_id") REFERENCES "listing_parking_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
