import {MigrationInterface, QueryRunner} from "typeorm";

export class addCombinedExternalListings1681750950575 implements MigrationInterface {
    name = 'addCombinedExternalListings1681750950575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "external_listings" ("id" uuid NOT NULL, "assets" jsonb NOT NULL, "household_size_min" integer, "household_size_max" integer, "units_available" integer, "application_due_date" TIMESTAMP WITH TIME ZONE, "application_open_date" TIMESTAMP WITH TIME ZONE, "name" text NOT NULL, "waitlist_current_size" integer, "waitlist_max_size" integer, "is_waitlist_open" boolean, "status" text NOT NULL, "review_order_type" text NOT NULL, "published_at" TIMESTAMP WITH TIME ZONE, "closed_at" TIMESTAMP WITH TIME ZONE, "updated_at" TIMESTAMP WITH TIME ZONE, "last_application_update_at" TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01', "county" text, "city" text, "neighborhood" text, "reserved_community_type_name" text, "url_slug" text NOT NULL, "units_summarized" jsonb, "images" jsonb, "multiselect_questions" jsonb, "jurisdiction" jsonb, "reserved_community_type" jsonb, "units" jsonb, "building_address" jsonb, "features" jsonb, "utilities" jsonb, CONSTRAINT "PK_ff07a715bb1c8a4ca5d3d35ccdc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c18a7b0351cd96e765e2ae461f" ON "external_listings" ("units_available") `);
        await queryRunner.query(`CREATE INDEX "IDX_1bad4cf101b7b995628d306697" ON "external_listings" ("application_due_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_1fab4dc21264bc87b8bac44505" ON "external_listings" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_a664e117ef6f9cd89b51349399" ON "external_listings" ("is_waitlist_open") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d977dcc9a2f5784bf3e73463a" ON "external_listings" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_abd759d30583f6eca365a4c8a2" ON "external_listings" ("published_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_addefe299e91a21f40bd58ecfd" ON "external_listings" ("closed_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0283eabb306810510bd1d62f2" ON "external_listings" ("updated_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_9cba6dd3dd2f9d2ebe20605516" ON "external_listings" ("county") `);
        await queryRunner.query(`CREATE INDEX "IDX_9f7379f496658e0f9992f3421d" ON "external_listings" ("neighborhood") `);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "afs_last_run_at" SET DEFAULT '1970-01-01'`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "last_application_update_at" SET DEFAULT '1970-01-01'`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "UQ_87b8888186ca9769c960e926870" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`CREATE VIEW "combined_listings" AS (
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

-- filter/sort criteria
addr.county,
addr.city,
l.neighborhood,
rct.name as "reserved_community_type_name",

null as "url_slug", -- url_slug, intentionally null
null as "units_summarized", -- units_summarized, intentionally null
imgs.json AS "images",
msq.json AS "multiselect_questions",

-- jurisdiction
jsonb_build_object(
  'id', j.id,
  'name', j.name
) AS "jurisdiction",

-- reserved_community_type; may not exist
CASE
  WHEN rct.id IS NOT NULL THEN 
    jsonb_build_object(
      'name', rct.name,
      'id', rct.id
    )
  ELSE NULL
END AS "reserved_community_type",

-- units
units.json AS "units",

-- building address
jsonb_build_object(
  'city', addr.city,
  'state', addr.state,
  'street', addr.street,
  'street2', addr.street2,
  'zipCode', addr.zip_code,
  'latitude', addr.latitude,
  'longitude', addr.longitude
) AS "building_address",

-- features; may not exist
CASE
  WHEN feat.id IS NOT NULL THEN 
    jsonb_build_object(
      'elevator', feat.elevator,
      'wheelchairRamp', feat.wheelchair_ramp,
      'serviceAnimalsAllowed', feat.service_animals_allowed,
      'accessibleParking', feat.accessible_parking,
      'parkingOnSite', feat.parking_on_site,
      'inUnitWasherDryer', feat.in_unit_washer_dryer,
      'laundryInBuilding', feat.laundry_in_building,
      'barrierFreeEntrance', feat.barrier_free_entrance,
      'rollInShower', feat.roll_in_shower,
      'grabBars', feat.grab_bars,
      'heatingInUnit', feat.heating_in_unit,
      'acInUnit', feat.ac_in_unit
    )
  ELSE NULL
END AS "features",

-- utilities; may not exist
CASE
  WHEN util.id IS NOT NULL THEN 
    jsonb_build_object(
      'water', util.water,
      'gas', util.gas,
      'trash', util.trash,
      'sewer', util.sewer,
      'electricity', util.electricity,
      'cable', util.cable,
      'phone', util.phone,
      'internet', util.internet
    )
  ELSE NULL
END AS "utilities",

agents.json as "leasing_agents",

false as "is_external"

FROM listings l

-- jurisdiction
INNER JOIN jurisdictions j
ON l.jurisdiction_id = j.id

-- features
LEFT JOIN listing_features feat
ON l.features_id = feat.id

-- reserved community type
LEFT JOIN reserved_community_types rct
ON l.reserved_community_type_id = rct.id

-- utilities
LEFT JOIN listing_utilities util
ON l.utilities_id = util.id

-- address
LEFT JOIN "address" addr
ON l.building_address_id = addr.id

-- units
LEFT JOIN (
SELECT 
  listing_id,
  jsonb_agg(
    jsonb_build_object(
      'id', u.id,
      'annualIncomeMin', u.annual_income_min,
      'annualIncomeMax', u.annual_income_max,
      'monthlyIncomeMin', u.monthly_income_min,
      'monthlyRent', u.monthly_rent,
      'monthlyRentAsPercentOfIncome', CAST(u.monthly_rent_as_percent_of_income as text),
      'amiPercentage', u.ami_percentage,
      'floor', u.floor,
      'maxOccupancy', u.max_occupancy,
      'minOccupancy', u.min_occupancy,
      'sqFeet', CAST(u.sq_feet as text),
      'numBedrooms', u.num_bedrooms,
      'numBathrooms', u.num_bathrooms,
      'unitType', json_build_object(
        'id', u.unit_type_id,
        'name', t.name
      ),
      'amiChartOverride', 
      CASE
        WHEN ami.id IS NOT NULL THEN json_build_object(
          'id', u.ami_chart_override_id,
          'items', ami.items
        )
        ELSE NULL
      END
    )
  ) as "json"
  FROM units u
  INNER JOIN unit_types t
  ON u.unit_type_id = t.id
  LEFT JOIN unit_ami_chart_overrides ami
  ON u.ami_chart_override_id = ami.id
  GROUP BY u.listing_id
) AS units
ON l.id = units.listing_id

-- multiselect questions
LEFT JOIN (
SELECT
  listing_id,
  jsonb_agg(
    jsonb_build_object(
      'ordinal', ordinal,
      'multiselectQuestion', json_build_object(
        'id', msq.id
      )
    )
  ) AS "json"
FROM listing_multiselect_questions lmsq
INNER JOIN multiselect_questions msq
ON lmsq.multiselect_question_id = msq.id
GROUP BY listing_id
) as msq
ON l.id = msq.listing_id

-- images
LEFT JOIN (
SELECT
  listing_id,
  jsonb_agg(
    jsonb_build_object(
      'ordinal', ordinal,
      'image', json_build_object(
        'fileId', assets.file_id,
        'label', assets.label,
        'id', assets.id
      )
    )
  ) AS "json"
FROM listing_images img
INNER JOIN assets
ON img.image_id = assets.id
GROUP BY listing_id
) as imgs
ON l.id = imgs.listing_id

-- leasing agents
LEFT JOIN (
SELECT
  la.listings_id,
  jsonb_agg(
    jsonb_build_object(
      'id', la.user_accounts_id
    )
  ) AS "json"
FROM listings_leasing_agents_user_accounts la
GROUP BY la.listings_id
) as agents
ON l.id = agents.listings_id
) UNION (
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
"county",
"city",
"neighborhood", 
"reserved_community_type_name",
"url_slug",
"units_summarized",
"images",
"multiselect_questions",
"jurisdiction",
"reserved_community_type",
"units",
"building_address",
"features",
"utilities",
null, -- leasing_agents; not available in base view and probably not useful anyway
true
FROM "external_listings"
)`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","combined_listings","(\n  SELECT\nl.id,\nl.assets,\nl.household_size_min,\nl.household_size_max,\nl.units_available,\nl.application_due_date,\nl.application_open_date,\nl.name,\nl.waitlist_current_size,\nl.waitlist_max_size,\nl.is_waitlist_open,\nCAST(l.status AS text),\nCAST(l.review_order_type AS text),\nl.published_at,\nl.closed_at,\nl.updated_at,\nl.last_application_update_at,\n\n-- filter/sort criteria\naddr.county,\naddr.city,\nl.neighborhood,\nrct.name as \"reserved_community_type_name\",\n\nnull as \"url_slug\", -- url_slug, intentionally null\nnull as \"units_summarized\", -- units_summarized, intentionally null\nimgs.json AS \"images\",\nmsq.json AS \"multiselect_questions\",\n\n-- jurisdiction\njsonb_build_object(\n  'id', j.id,\n  'name', j.name\n) AS \"jurisdiction\",\n\n-- reserved_community_type; may not exist\nCASE\n  WHEN rct.id IS NOT NULL THEN \n    jsonb_build_object(\n      'name', rct.name,\n      'id', rct.id\n    )\n  ELSE NULL\nEND AS \"reserved_community_type\",\n\n-- units\nunits.json AS \"units\",\n\n-- building address\njsonb_build_object(\n  'city', addr.city,\n  'state', addr.state,\n  'street', addr.street,\n  'street2', addr.street2,\n  'zipCode', addr.zip_code,\n  'latitude', addr.latitude,\n  'longitude', addr.longitude\n) AS \"building_address\",\n\n-- features; may not exist\nCASE\n  WHEN feat.id IS NOT NULL THEN \n    jsonb_build_object(\n      'elevator', feat.elevator,\n      'wheelchairRamp', feat.wheelchair_ramp,\n      'serviceAnimalsAllowed', feat.service_animals_allowed,\n      'accessibleParking', feat.accessible_parking,\n      'parkingOnSite', feat.parking_on_site,\n      'inUnitWasherDryer', feat.in_unit_washer_dryer,\n      'laundryInBuilding', feat.laundry_in_building,\n      'barrierFreeEntrance', feat.barrier_free_entrance,\n      'rollInShower', feat.roll_in_shower,\n      'grabBars', feat.grab_bars,\n      'heatingInUnit', feat.heating_in_unit,\n      'acInUnit', feat.ac_in_unit\n    )\n  ELSE NULL\nEND AS \"features\",\n\n-- utilities; may not exist\nCASE\n  WHEN util.id IS NOT NULL THEN \n    jsonb_build_object(\n      'water', util.water,\n      'gas', util.gas,\n      'trash', util.trash,\n      'sewer', util.sewer,\n      'electricity', util.electricity,\n      'cable', util.cable,\n      'phone', util.phone,\n      'internet', util.internet\n    )\n  ELSE NULL\nEND AS \"utilities\",\n\nagents.json as \"leasing_agents\",\n\nfalse as \"is_external\"\n\nFROM listings l\n\n-- jurisdiction\nINNER JOIN jurisdictions j\nON l.jurisdiction_id = j.id\n\n-- features\nLEFT JOIN listing_features feat\nON l.features_id = feat.id\n\n-- reserved community type\nLEFT JOIN reserved_community_types rct\nON l.reserved_community_type_id = rct.id\n\n-- utilities\nLEFT JOIN listing_utilities util\nON l.utilities_id = util.id\n\n-- address\nLEFT JOIN \"address\" addr\nON l.building_address_id = addr.id\n\n-- units\nLEFT JOIN (\nSELECT \n  listing_id,\n  jsonb_agg(\n    jsonb_build_object(\n      'id', u.id,\n      'monthlyIncomeMin', u.monthly_income_min,\n      'floor', u.floor,\n      'maxOccupancy', u.max_occupancy,\n      'minOccupancy', u.min_occupancy,\n      'monthlyRent', u.monthly_rent,\n      'sqFeet', CAST(u.sq_feet as text),\n      'monthlyRentAsPercentOfIncome', CAST(u.monthly_rent_as_percent_of_income as text),\n      'unitType', json_build_object(\n        'id', u.unit_type_id,\n        'name', t.name\n      ),\n      'amiChartOverride', \n      CASE\n        WHEN ami.id IS NOT NULL THEN json_build_object(\n          'id', u.ami_chart_override_id,\n          'items', ami.items\n        )\n        ELSE NULL\n      END\n    )\n  ) as \"json\"\n  FROM units u\n  INNER JOIN unit_types t\n  ON u.unit_type_id = t.id\n  LEFT JOIN unit_ami_chart_overrides ami\n  ON u.ami_chart_override_id = ami.id\n  GROUP BY u.listing_id\n) AS units\nON l.id = units.listing_id\n\n-- multiselect questions\nLEFT JOIN (\nSELECT\n  listing_id,\n  jsonb_agg(\n    jsonb_build_object(\n      'ordinal', ordinal,\n      'multiselectQuestion', json_build_object(\n        'id', msq.id\n      )\n    )\n  ) AS \"json\"\nFROM listing_multiselect_questions lmsq\nINNER JOIN multiselect_questions msq\nON lmsq.multiselect_question_id = msq.id\nGROUP BY listing_id\n) as msq\nON l.id = msq.listing_id\n\n-- images\nLEFT JOIN (\nSELECT\n  listing_id,\n  jsonb_agg(\n    jsonb_build_object(\n      'ordinal', ordinal,\n      'image', json_build_object(\n        'fileId', assets.file_id,\n        'label', assets.label,\n        'id', assets.id\n      )\n    )\n  ) AS \"json\"\nFROM listing_images img\nINNER JOIN assets\nON img.image_id = assets.id\nGROUP BY listing_id\n) as imgs\nON l.id = imgs.listing_id\n\n-- leasing agents\nLEFT JOIN (\nSELECT\n  la.listings_id,\n  jsonb_agg(\n    jsonb_build_object(\n      'id', la.user_accounts_id\n    )\n  ) AS \"json\"\nFROM listings_leasing_agents_user_accounts la\nGROUP BY la.listings_id\n) as agents\nON l.id = agents.listings_id\n) UNION (\n  SELECT \n\"id\",\n\"assets\", \n\"household_size_min\",\n\"household_size_max\",\n\"units_available\", \n\"application_due_date\", \n\"application_open_date\", \n\"name\", \n\"waitlist_current_size\", \n\"waitlist_max_size\", \n\"is_waitlist_open\",\n\"status\", \n\"review_order_type\", \n\"published_at\", \n\"closed_at\", \n\"updated_at\",\n\"last_application_update_at\", \n\"county\",\n\"city\",\n\"neighborhood\", \n\"reserved_community_type_name\",\n\"url_slug\",\n\"units_summarized\",\n\"images\",\n\"multiselect_questions\",\n\"jurisdiction\",\n\"reserved_community_type\",\n\"units\",\n\"building_address\",\n\"features\",\n\"utilities\",\nnull, -- leasing_agents; not available in base view and probably not useful anyway\ntrue\nFROM \"external_listings\"\n)"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","combined_listings","public"]);
        await queryRunner.query(`DROP VIEW "combined_listings"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "UQ_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "last_application_update_at" SET DEFAULT '1970-01-01 00:00:00+00'`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "afs_last_run_at" SET DEFAULT '1970-01-01 00:00:00+00'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f7379f496658e0f9992f3421d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9cba6dd3dd2f9d2ebe20605516"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0283eabb306810510bd1d62f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_addefe299e91a21f40bd58ecfd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abd759d30583f6eca365a4c8a2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d977dcc9a2f5784bf3e73463a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a664e117ef6f9cd89b51349399"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fab4dc21264bc87b8bac44505"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1bad4cf101b7b995628d306697"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c18a7b0351cd96e765e2ae461f"`);
        await queryRunner.query(`DROP TABLE "external_listings"`);
    }

}
