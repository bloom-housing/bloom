CREATE VIEW "map_marker" AS (
    SELECT
        l.id,
        CAST(l.status AS text),
        CAST(addr.latitude AS text),
        CAST(addr.longitude AS text),
        false as "is_external"
    FROM
        listings l
        LEFT JOIN "address" addr ON l.building_address_id = addr.id
    WHERE
        l.status = 'active'
)
UNION
(
    SELECT
        "id",
        "status",
        building_address ->> 'latitude',
        building_address ->> 'longitude',
        true
    FROM
        "external_listings"
)
