-- A jurisdiction's rows in `translations` are its email overrides: nothing else reads that table.
-- Flatten them to the dotted keys the rows use, so Partners can edit them on the email scope.
-- Generic rows are not moved; those values now ship in api/src/locales/email-translations.ts.
WITH RECURSIVE flattened AS (
  SELECT
    t."jurisdiction_id",
    t."language",
    entry.key AS path,
    entry.value
  FROM "translations" t
  CROSS JOIN LATERAL jsonb_each(t."translations") entry
  WHERE t."jurisdiction_id" IS NOT NULL

  UNION ALL

  SELECT
    f."jurisdiction_id",
    f."language",
    f.path || '.' || entry.key,
    entry.value
  FROM flattened f
  CROSS JOIN LATERAL jsonb_each(f.value) entry
  WHERE jsonb_typeof(f.value) = 'object'
)
INSERT INTO "translation_strings" ("jurisdiction_id", "language", "site", "key", "value", "created_at", "updated_at")
SELECT
  "jurisdiction_id",
  "language",
  'email'::"site_enum",
  path,
  value #>> '{}',
  now() AT TIME ZONE 'UTC',
  now() AT TIME ZONE 'UTC'
FROM flattened
WHERE jsonb_typeof(value) = 'string'
ON CONFLICT ("jurisdiction_id", "language", "site", "key") DO NOTHING;
