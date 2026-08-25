DO $$
DECLARE
  bayarea_jurisdiction_id UUID;
BEGIN
SELECT
  j.id INTO bayarea_jurisdiction_id
FROM
  jurisdictions j
WHERE
  j.name = 'Bay Area'
ORDER BY
  j.created_at ASC
LIMIT
  1;

-- Add San Francisco jurisdiction - this is new functionality separate from the corification migration.
INSERT INTO
  jurisdictions
SELECT
  (jsonb_populate_record(NULL :: jurisdictions, sf_jurisdiction)).*
FROM
  (
    SELECT
      (
        (
          SELECT
            to_jsonb(jurisdictions)
          FROM
            jurisdictions
          WHERE
            id = bayarea_jurisdiction_id
        ) - 'id' - 'name' - 'created_at' - 'updated_at'
      ) || jsonb_build_object(
        'id', uuid_generate_v4(),
        'name', 'San Francisco',
        'created_at', to_jsonb(now()),
        'updated_at', to_jsonb(now())
      ) AS sf_jurisdiction
  ) t;

-- Make all jurisdictions that are not Bay Area a sub-jurisdiction of Bay Area
INSERT INTO
  "_SubJurisdictions" ("A", "B")
SELECT
  j.id,
  bayarea_jurisdiction_id
FROM
  jurisdictions j
WHERE
  j.name != 'Bay Area';

-- New jurisdiction fields
UPDATE
  jurisdictions
SET
  visible_spoken_languages = ARRAY ['chineseCantonese','chineseMandarin','english','filipino','korean','russian','spanish','vietnamese','notListed'] :: "spoken_language_enum" [],
  visible_household_member_relationships = ARRAY ['spousePartner','girlfriendBoyfriend','child','parent','friend','brotherSister','cousin','auntUncle','nephewNiece','grandparentGreatGrandparent','liveInAide','other','aideOrAttendant'] :: "household_member_relationship_enum" [],
  visible_accessibility_priority_types = ARRAY ['mobility','hearing','vision','hearingAndVision','mobilityAndHearing','mobilityAndVision','mobilityHearingAndVision'] :: "unit_accessibility_priority_type_enum" [],
  updated_at = now();

END $$;