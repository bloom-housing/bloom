-- CreateEnum
CREATE TYPE "BackgroundJobStatusEnum" AS ENUM ('processing', 'completed', 'failed');

-- CreateTable
CREATE TABLE "background_job" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "listing_id" UUID NOT NULL,
    "requested_by_user_id" UUID NOT NULL,
    "status" "BackgroundJobStatusEnum" NOT NULL,
    "total_records" INTEGER,
    "input_s3_key" TEXT NOT NULL,
    "error_message" TEXT,
    "error_row" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "background_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "background_job_listing_id_status_idx" ON "background_job"("listing_id", "status");

-- AddForeignKey
ALTER TABLE "background_job" ADD CONSTRAINT "background_job_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
