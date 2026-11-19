-- Copy of migration 71_move_jurisdiction_email_translations but don't include the generic rows check
WITH RECURSIVE flattened AS (
  SELECT
    t."jurisdiction_id",
    t."language",
    entry.key AS path,
    entry.value
  FROM "translations" t
  CROSS JOIN LATERAL jsonb_each(t."translations") entry

  UNION ALL

  SELECT
    f."jurisdiction_id",
    f."language",
    f.path || '.' || entry.key,
    entry.value
  FROM flattened f
  CROSS JOIN LATERAL jsonb_each(f.value) entry
  WHERE jsonb_typeof(f.value) = 'object'
),
leaves AS (
  SELECT
    "jurisdiction_id",
    "language",
    path,
    CASE WHEN jsonb_typeof(value) = 'null' THEN '' ELSE value #>> '{}' END AS value
  FROM flattened
  WHERE jsonb_typeof(value) IN ('string', 'null')
)
INSERT INTO "translation_strings" ("jurisdiction_id", "language", "site", "key", "value", "created_at", "updated_at")
SELECT
  j."jurisdiction_id",
  j."language",
  'email'::"site_enum",
  j.path,
  j.value,
  now() AT TIME ZONE 'UTC',
  now() AT TIME ZONE 'UTC'
FROM leaves j
WHERE j."jurisdiction_id" IS NULL
ON CONFLICT ("jurisdiction_id", "language", "site", "key") DO NOTHING;
