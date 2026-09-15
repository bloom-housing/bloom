-- Branding columns for runtime theming. All nullable; a row with no brand renders the defaults.
ALTER TABLE "jurisdictions" ADD COLUMN "brand" JSONB;
ALTER TABLE "jurisdictions" ADD COLUMN "brand_logo_asset_id" UUID;
ALTER TABLE "jurisdictions" ADD COLUMN "brand_favicon_asset_id" UUID;

ALTER TABLE "jurisdictions" ADD CONSTRAINT "jurisdictions_brand_logo_asset_id_fkey" FOREIGN KEY ("brand_logo_asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "jurisdictions" ADD CONSTRAINT "jurisdictions_brand_favicon_asset_id_fkey" FOREIGN KEY ("brand_favicon_asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
