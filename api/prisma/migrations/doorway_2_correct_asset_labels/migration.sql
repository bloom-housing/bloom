UPDATE assets
SET label = 'building'
WHERE id IN (
    SELECT image_id
    FROM listing_images
    WHERE listing_id IN (
        SELECT id
        FROM listings
        WHERE external_listing_id IS NULL
    )
);
