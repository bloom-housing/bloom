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

  IF la_jurisdiction_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE jurisdictions
  SET
    referral_summary_default = 'Some additional units in this property are only available through a referral from a local nonprofit or agency. To learn if you qualify, please call the number listed above or reach out to the property manager.',
    updated_at = now()
  WHERE id = la_jurisdiction_id;
END $$;
