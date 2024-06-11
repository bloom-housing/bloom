-- Add field to capture most recent listing content update time
ALTER TABLE "listings" ADD COLUMN "content_updated_at" TIMESTAMPTZ(6);