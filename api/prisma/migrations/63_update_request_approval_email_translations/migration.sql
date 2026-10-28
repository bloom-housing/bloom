-- Adds listing file number to the request approval email

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{requestApproval}',
  COALESCE(translations->'requestApproval', '{}'::jsonb) || '{
    "fileNumber": "The listing file number is %{listingFileNumber}."
  }'::jsonb
)
WHERE language = 'en';
