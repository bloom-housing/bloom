-- CreateEnum
CREATE TYPE "site_enum" AS ENUM ('public', 'partners');

-- CreateEnum
CREATE TYPE "translation_origin" AS ENUM ('machine', 'human');

-- CreateTable
CREATE TABLE "jurisdiction_content" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "jurisdiction_id" UUID NOT NULL,
    "language" "languages_enum" NOT NULL,
    "footer" JSONB,
    "faq" JSONB,
    "resources" JSONB,
    "disclaimers" JSONB,
    "contact" JSONB,

    CONSTRAINT "jurisdiction_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translation_strings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "jurisdiction_id" UUID,
    "language" "languages_enum" NOT NULL,
    "site" "site_enum",
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "source_hash" TEXT,
    "origin" "translation_origin",

    CONSTRAINT "translation_strings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jurisdiction_content_jurisdiction_id_language_key" ON "jurisdiction_content"("jurisdiction_id", "language");

-- CreateIndex
CREATE INDEX "translation_strings_jurisdiction_id_language_site_idx" ON "translation_strings"("jurisdiction_id", "language", "site");

-- CreateIndex
-- NULLS NOT DISTINCT (hand-added; Prisma cannot express it in the schema) so base rows (null
-- jurisdiction_id and site) and global Partners rows (null jurisdiction_id) cannot be duplicated.
-- Requires Postgres 15+.
CREATE UNIQUE INDEX "translation_strings_jurisdiction_id_language_site_key_key" ON "translation_strings"("jurisdiction_id", "language", "site", "key") NULLS NOT DISTINCT;

-- AddForeignKey
ALTER TABLE "jurisdiction_content" ADD CONSTRAINT "jurisdiction_content_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "translation_strings" ADD CONSTRAINT "translation_strings_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
