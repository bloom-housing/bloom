-- AlterTable
ALTER TABLE "listings" 
ADD COLUMN "parking_types_id" UUID;

-- CreateTable
CREATE TABLE "parking_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "on_street" BOOLEAN,
    "off_street" BOOLEAN,
    "garage" BOOLEAN,
    "carport" BOOLEAN,

    CONSTRAINT "parking_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listings_parking_types_id_key" ON "listings"("parking_types_id");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_parking_types_id_fkey" FOREIGN KEY ("parking_types_id") REFERENCES "parking_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
