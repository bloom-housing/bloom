DROP VIEW IF EXISTS "combined_listings";

CREATE VIEW "combined_listings" AS (
    SELECT
        l.id,
        l.assets,
        l.household_size_min,
        l.household_size_max,
        l.units_available,
        l.application_due_date,
        l.application_open_date,
        l.name,
        l.waitlist_current_size,
        l.waitlist_max_size,
        l.is_waitlist_open,
        CAST(l.status AS text),
        CAST(l.review_order_type AS text),
        l.published_at,
        l.closed_at,
        l.updated_at,
        l.last_application_update_at,
        l.neighborhood,
        rct.name as "reserved_community_type_name",
        null as "url_slug",
        jsonb_build_object('id', j.id, 'name', j.name) AS "jurisdiction",
        CASE
            WHEN rct.id IS NOT NULL THEN jsonb_build_object('name', rct.name, 'id', rct.id)
            ELSE NULL
        END AS "reserved_community_types",
        jsonb_build_object(
            'city',
            addr.city,
            'county',
            addr.county,
            'state',
            addr.state,
            'street',
            addr.street,
            'street2',
            addr.street2,
            'zipCode',
            addr.zip_code,
            'latitude',
            addr.latitude,
            'longitude',
            addr.longitude
        ) AS "listings_building_address",
        imgs.json AS "listing_images",
        null as "units_summarized",
        false as "is_external"
    FROM
        listings l
        LEFT JOIN "address" addr ON l.building_address_id = addr.id -- Some columns representing numeric data use the "text" type
        INNER JOIN jurisdictions j ON l.jurisdiction_id = j.id
        LEFT JOIN (
            SELECT
                listing_id,
                jsonb_agg(
                    jsonb_build_object(
                        'ordinal',
                        ordinal,
                        'assets',
                        json_build_object(
                            'fileId',
                            assets.file_id,
                            'label',
                            assets.label,
                            'id',
                            assets.id
                        )
                    )
                ) AS "json"
            FROM
                listing_images img
                INNER JOIN assets ON img.image_id = assets.id
            GROUP BY
                listing_id
        ) as imgs ON l.id = imgs.listing_id
        LEFT JOIN reserved_community_types rct ON l.reserved_community_type_id = rct.id
    where
        l.status = 'active'
)
UNION
(
    SELECT
        "id",
        "assets",
        "household_size_min",
        "household_size_max",
        "units_available",
        "application_due_date",
        "application_open_date",
        "name",
        "waitlist_current_size",
        "waitlist_max_size",
        "is_waitlist_open",
        "status",
        "review_order_type",
        "published_at",
        "closed_at",
        "updated_at",
        "last_application_update_at",
        "neighborhood",
        "reserved_community_type_name",
        "url_slug",
        "jurisdiction",
        "reserved_community_type",
        "building_address",
        "images",
        "units_summarized",
        true
    FROM
        "external_listings"
);

CREATE VIEW "combined_listings_units" AS (
    SELECT
        l.id,
        units.json AS "units"
    FROM
        listings l
        LEFT JOIN (
            SELECT
                listing_id,
                jsonb_agg(
                    jsonb_build_object(
                        'id',
                        u.id,
                        'annualIncomeMin',
                        u.annual_income_min,
                        'numAnnualIncomeMin',
                        CASE
                            WHEN u.annual_income_min ~ '^[0-9]+\.{0,1}[0-9]+$' THEN TO_NUMBER(u.annual_income_min, '99999')
                            ELSE 0
                        END,
                        'annualIncomeMax',
                        u.annual_income_max,
                        'numAnnualIncomeMax',
                        CASE
                            WHEN u.annual_income_max ~ '^[0-9]+\.{0,1}[0-9]+$' THEN TO_NUMBER(u.annual_income_max, '99999')
                            ELSE 0
                        END,
                        'monthlyIncomeMin',
                        u.monthly_income_min,
                        'numMonthlyIncomeMin',
                        CASE
                            WHEN u.monthly_income_min ~ '^[0-9]+\.{0,1}[0-9]+$' THEN TO_NUMBER(u.monthly_income_min, '99999')
                            ELSE 0
                        END,
                        'monthlyRent',
                        u.monthly_rent,
                        'numMonthlyRent',
                        CASE
                            WHEN u.monthly_rent ~ '^[0-9]+\.{0,1}[0-9]+$' THEN TO_NUMBER(u.monthly_rent, '99999')
                            ELSE 0
                        END,
                        -- monthlyRentAsPercentOfIncome is a numeric field, but the API converts it to text
                        'monthlyRentAsPercentOfIncome',
                        CAST(u.monthly_rent_as_percent_of_income as text),
                        -- the numeric version is for consistent filtering across internal and external listings
                        'numMonthlyRentAsPercentOfIncome',
                        u.monthly_rent_as_percent_of_income,
                        'amiPercentage',
                        u.ami_percentage,
                        'numAmiPercentage',
                        CASE
                            WHEN u.ami_percentage ~ '^[0-9]+\.{0,1}[0-9]+$' THEN TO_NUMBER(u.ami_percentage, '99999')
                            ELSE 0
                        END,
                        'floor',
                        u.floor,
                        'maxOccupancy',
                        u.max_occupancy,
                        'minOccupancy',
                        u.min_occupancy,
                        -- sqFeet is a numeric field, but the API converts it to text
                        'sqFeet',
                        CAST(u.sq_feet as text),
                        -- the numeric version is for consistent filtering across internal and external listings
                        'numSqFeet',
                        u.sq_feet,
                        'numBedrooms',
                        u.num_bedrooms,
                        'numBathrooms',
                        u.num_bathrooms,
                        'unitTypes',
                        json_build_object(
                            'id',
                            u.unit_type_id,
                            'name',
                            t.name
                        ),
                        'amiChartOverride',
                        CASE
                            WHEN ami.id IS NOT NULL THEN json_build_object(
                                'id',
                                u.ami_chart_override_id,
                                'items',
                                ami.items
                            )
                            ELSE NULL
                        END
                    )
                ) as "json"
            FROM
                units u
                INNER JOIN unit_types t ON u.unit_type_id = t.id
                LEFT JOIN unit_ami_chart_overrides ami ON u.ami_chart_override_id = ami.id
            GROUP BY
                u.listing_id
        ) AS units ON l.id = units.listing_id
    where
        l.status = 'active'
)
UNION
(
    SELECT
        "id",
        "units"
    FROM
        "external_listings"
)
