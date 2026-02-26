-- DropForeignKey
ALTER TABLE "listing_snapshot" DROP CONSTRAINT "listing_snapshot_property_snapshot_id_fkey";

-- DropForeignKey
ALTER TABLE "property_snapshot" DROP CONSTRAINT "property_snapshot_jurisdiction_id_fkey";

-- AlterTable
ALTER TABLE "listing_snapshot" DROP COLUMN "property_snapshot_id";
ALTER TABLE "listing_snapshot" ADD COLUMN     "property_id" UUID;

-- DropTable
DROP TABLE "property_snapshot";

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "listing_snapshot" ADD COLUMN "parking_type_snapshot_id" UUID;


-- CreateTable
CREATE TABLE "listing_parking_type_snapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_id" UUID NOT NULL,
    "original_created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "on_street" BOOLEAN,
    "off_street" BOOLEAN,
    "garage" BOOLEAN,
    "carport" BOOLEAN,

    CONSTRAINT "listing_parking_type_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listing_snapshot_parking_type_snapshot_id_key" ON "listing_snapshot"("parking_type_snapshot_id");

-- AddForeignKey
ALTER TABLE "listing_snapshot" ADD CONSTRAINT "listing_snapshot_parking_type_snapshot_id_fkey" FOREIGN KEY ("parking_type_snapshot_id") REFERENCES "listing_parking_type_snapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AlterTable
ALTER TABLE "paper_application_snapshot" ADD COLUMN "original_created_at" TIMESTAMP(6) NOT NULL;
ALTER TABLE "paper_application_snapshot" ADD COLUMN "original_id" UUID NOT NULL;

