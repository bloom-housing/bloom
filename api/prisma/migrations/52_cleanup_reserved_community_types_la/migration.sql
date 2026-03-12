DO $$
DECLARE
  la_jurisdiction_id UUID;
BEGIN
  SELECT j.id
  INTO la_jurisdiction_id
  FROM jurisdictions j
  WHERE j.name = 'Los Angeles'
  ORDER BY j.created_at ASC
  LIMIT 1;

  -- If the Los Angeles jurisdiction does not yet exist, safely no-op
  IF la_jurisdiction_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO reserved_community_types (created_at, updated_at, description, jurisdiction_id, name)
  SELECT
    now(),
    now(),
    NULL,
    la_jurisdiction_id,
    allowed_name
  FROM unnest(ARRAY['senior55', 'senior62', 'referralOnly']::TEXT[]) AS allowed_name
  WHERE NOT EXISTS (
    SELECT 1
    FROM reserved_community_types rct
    WHERE rct.name = allowed_name
  );

  CREATE TEMP TABLE tmp_reserved_community_type_keep (
    name TEXT PRIMARY KEY,
    keep_id UUID NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO tmp_reserved_community_type_keep (name, keep_id)
  SELECT
    allowed_name,
    (
      SELECT rct.id
      FROM reserved_community_types rct
      WHERE rct.name = allowed_name
      ORDER BY
        CASE
          WHEN rct.jurisdiction_id = la_jurisdiction_id THEN 0
          ELSE 1
        END,
        rct.created_at ASC,
        rct.id ASC
      LIMIT 1
    )
  FROM unnest(ARRAY['senior55', 'senior62', 'referralOnly']::TEXT[]) AS allowed_name;

  UPDATE reserved_community_types rct
  SET
    jurisdiction_id = la_jurisdiction_id,
    updated_at = now()
  FROM tmp_reserved_community_type_keep keep
  WHERE rct.id = keep.keep_id
    AND rct.jurisdiction_id IS DISTINCT FROM la_jurisdiction_id;

  UPDATE listings l
  SET
    reserved_community_type_id = keep.keep_id,
    updated_at = now()
  FROM reserved_community_types rct
  JOIN tmp_reserved_community_type_keep keep
    ON keep.name = rct.name
  WHERE l.reserved_community_type_id = rct.id
    AND rct.id <> keep.keep_id;

  UPDATE listing_snapshot ls
  SET reserved_community_type_id = keep.keep_id
  FROM reserved_community_types rct
  JOIN tmp_reserved_community_type_keep keep
    ON keep.name = rct.name
  WHERE ls.reserved_community_type_id = rct.id
    AND rct.id <> keep.keep_id;

  UPDATE listings l
  SET
    reserved_community_type_id = NULL,
    updated_at = now()
  WHERE l.reserved_community_type_id IN (
    SELECT rct.id
    FROM reserved_community_types rct
    WHERE rct.name NOT IN ('senior55', 'senior62', 'referralOnly')
  );

  UPDATE listing_snapshot ls
  SET reserved_community_type_id = NULL
  WHERE ls.reserved_community_type_id IN (
    SELECT rct.id
    FROM reserved_community_types rct
    WHERE rct.name NOT IN ('senior55', 'senior62', 'referralOnly')
  );

  DELETE FROM reserved_community_types rct
  WHERE rct.id NOT IN (
    SELECT keep.keep_id
    FROM tmp_reserved_community_type_keep keep
  );
END $$;
