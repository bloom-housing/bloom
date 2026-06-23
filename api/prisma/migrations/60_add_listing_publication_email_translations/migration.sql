-- Adds listing publication email translations.

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    jsonb_set(
      translations,
      '{listingApproved}',
      COALESCE(translations->'listingApproved', '{}'::jsonb) || '{
        "header": "New published listing - %{listingName}"
      }'::jsonb
    ),
    '{listingScheduled}',
    COALESCE(translations->'listingScheduled', '{}'::jsonb) || '{
      "header": "New scheduled listing",
      "subject": "New scheduled listing - %{listingName}",
      "adminScheduled": "The %{listingName} listing has been approved by an administrator and is scheduled to be automatically published on %{date} between 12:00 AM and 2:00 AM. If you have questions or require changes, please contact an administrator."
    }'::jsonb
  ),
  '{listingPublished}',
  COALESCE(translations->'listingPublished', '{}'::jsonb) || '{
    "header": "New published listing",
    "subject": "New published listing - %{listingName}",
    "autoPublished": "The %{listingName} listing has been automatically published.",
    "viewPublished": "To view the published listing, please click on the link below"
  }'::jsonb
)
WHERE language = 'en'
  AND jurisdiction_id IS NULL;
