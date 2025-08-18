-- Updates brand in translations for emails.

UPDATE translations
SET translations = jsonb_set(translations, '{header.logoUrl}', '"https://detroitmi.gov/themes/custom/detroitminew/logo.png"')
WHERE language = 'en';
