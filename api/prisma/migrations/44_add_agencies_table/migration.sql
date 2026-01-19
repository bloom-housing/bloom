-- CreateTable
CREATE TABLE "agencies" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" TEXT NOT NULL,
    "jurisdictionsId" UUID,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_jurisdictionsId_fkey" FOREIGN KEY ("jurisdictionsId") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
