-- Update
UPDATE listings
    SET content_updated_at = updated_at
    WHERE content_updated_at IS NULL;
