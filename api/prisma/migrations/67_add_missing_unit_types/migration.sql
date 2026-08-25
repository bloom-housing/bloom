-- Unit types have historically been created by seeding rather than by migration, so
-- jurisdictions can be missing some (or all) of them. Insert every unit type, skipping
-- any that already exist, so existing databases only gain what they lack and new
-- jurisdictions get the full set.
INSERT INTO "unit_types" ("num_bedrooms", "name", "updated_at")
SELECT 0, 'studio'::"unit_type_enum", CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "unit_types" WHERE "name" = 'studio');

INSERT INTO "unit_types" ("num_bedrooms", "name", "updated_at")
SELECT 0, 'SRO'::"unit_type_enum", CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "unit_types" WHERE "name" = 'SRO');

INSERT INTO "unit_types" ("num_bedrooms", "name", "updated_at")
SELECT 1, 'oneBdrm'::"unit_type_enum", CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "unit_types" WHERE "name" = 'oneBdrm');

INSERT INTO "unit_types" ("num_bedrooms", "name", "updated_at")
SELECT 2, 'twoBdrm'::"unit_type_enum", CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "unit_types" WHERE "name" = 'twoBdrm');

INSERT INTO "unit_types" ("num_bedrooms", "name", "updated_at")
SELECT 3, 'threeBdrm'::"unit_type_enum", CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "unit_types" WHERE "name" = 'threeBdrm');

INSERT INTO "unit_types" ("num_bedrooms", "name", "updated_at")
SELECT 4, 'fourBdrm'::"unit_type_enum", CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "unit_types" WHERE "name" = 'fourBdrm');

INSERT INTO "unit_types" ("num_bedrooms", "name", "updated_at")
SELECT 5, 'fiveBdrm'::"unit_type_enum", CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "unit_types" WHERE "name" = 'fiveBdrm');

INSERT INTO "unit_types" ("num_bedrooms", "name", "updated_at")
SELECT 6, 'sixBdrm'::"unit_type_enum", CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "unit_types" WHERE "name" = 'sixBdrm');

INSERT INTO "unit_types" ("num_bedrooms", "name", "updated_at")
SELECT 7, 'sevenBdrm'::"unit_type_enum", CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "unit_types" WHERE "name" = 'sevenBdrm');
