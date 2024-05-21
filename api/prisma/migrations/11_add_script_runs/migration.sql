-- CreateTable
CREATE TABLE "script_runs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "script_name" TEXT NOT NULL,
    "triggering_user" UUID NOT NULL,
    "did_script_run" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "script_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "script_runs_script_name_key" ON "script_runs"("script_name");
