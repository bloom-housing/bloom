-- CreateEnum
CREATE TYPE "BackgroundJobStatusEnum" AS ENUM ('processing', 'completed', 'failed');

-- CreateTable
CREATE TABLE "background_job" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "requested_by_user_id" UUID NOT NULL,
    "status" "BackgroundJobStatusEnum" NOT NULL,
    "total_records" INTEGER,
    "input_s3_key" TEXT NOT NULL,
    "error_message" TEXT,
    "error_row" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed-at" TIMESTAMP(3),

    CONSTRAINT "background_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "background_job_listing_id_idx" ON "background_job"("listing_id");
