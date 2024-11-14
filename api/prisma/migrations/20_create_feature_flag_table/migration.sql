-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FeatureFlagsToJurisdictions" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_name_key" ON "feature_flags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_FeatureFlagsToJurisdictions_AB_unique" ON "_FeatureFlagsToJurisdictions"("A", "B");

-- CreateIndex
CREATE INDEX "_FeatureFlagsToJurisdictions_B_index" ON "_FeatureFlagsToJurisdictions"("B");

-- AddForeignKey
ALTER TABLE "_FeatureFlagsToJurisdictions" ADD CONSTRAINT "_FeatureFlagsToJurisdictions_A_fkey" FOREIGN KEY ("A") REFERENCES "feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureFlagsToJurisdictions" ADD CONSTRAINT "_FeatureFlagsToJurisdictions_B_fkey" FOREIGN KEY ("B") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
