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

  -- Add descriptions to existing community types
  UPDATE reserved_community_types
  SET
    description = 'At least one tenant must be 55 years of age or older. A second person living with the eligible senior must be at least 45 years of age or a spouse/partner or providing primary support. A disabled child or grandchild may reside in the unit, even if underage.',
    updated_at = now()
  WHERE name = 'senior55'
    AND jurisdiction_id = la_jurisdiction_id;

  UPDATE reserved_community_types
  SET
    description = 'This development is intended and operated for occupants where all residents must be at least  62 years of age. Exceptions exist for live-in caregivers or in specific, rare cases. These communities must adhere to policies demonstrating this intent and are exempt from familial status anti-discrimination laws, allowing them to exclude residents under 62.',
    updated_at = now()
  WHERE name = 'senior62'
    AND jurisdiction_id = la_jurisdiction_id;

  UPDATE reserved_community_types
  SET
    description = 'Pre-applications cannot be submitted through the Registry for this property because tenants are directly referred through the Coordinated Entry System (CES) or other referral agency. If you are experiencing homelessness and want to be considered for a supportive housing unit, please contact a Coordinated Entry System (CES) Access Point.',
    updated_at = now()
  WHERE name = 'referralOnly'
    AND jurisdiction_id = la_jurisdiction_id;

  -- Insert new reserved community types if they don't already exist
  INSERT INTO reserved_community_types (created_at, updated_at, description, jurisdiction_id, name)
  SELECT
    now(),
    now(),
    'Pre-applications cannot be submitted through the Registry for this property because tenants are directly referred through the Coordinated Entry System (CES) or other referral agency. If you are experiencing homelessness and want to be considered for a supportive housing unit, please contact a Coordinated Entry System (CES) Access Point.',
    la_jurisdiction_id,
    'referralOnly55'
  WHERE NOT EXISTS (
    SELECT 1
    FROM reserved_community_types rct
    WHERE rct.name = 'referralOnly55'
      AND rct.jurisdiction_id = la_jurisdiction_id
  );

  INSERT INTO reserved_community_types (created_at, updated_at, description, jurisdiction_id, name)
  SELECT
    now(),
    now(),
    'Pre-applications cannot be submitted through the Registry for this property because tenants are directly referred through the Coordinated Entry System (CES) or other referral agency. If you are experiencing homelessness and want to be considered for a supportive housing unit, please contact a Coordinated Entry System (CES) Access Point.',
    la_jurisdiction_id,
    'referralOnly62'
  WHERE NOT EXISTS (
    SELECT 1
    FROM reserved_community_types rct
    WHERE rct.name = 'referralOnly62'
      AND rct.jurisdiction_id = la_jurisdiction_id
  );
END $$;
