-- AlterTable
ALTER TABLE "listings" 
ADD COLUMN "property_id" UUID;

-- CreateTable
CREATE TABLE "Properties" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "url_title" TEXT,

    CONSTRAINT "Properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Properties_id_name_idx" ON "Properties"("id", "name");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
