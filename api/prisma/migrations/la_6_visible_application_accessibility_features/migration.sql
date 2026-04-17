UPDATE jurisdictions
SET
  visible_application_accessibility_features = ARRAY['mobility', 'hearingAndVision']::"application_accessibility_feature_enum"[],
  updated_at = now()
WHERE name = 'Los Angeles';
