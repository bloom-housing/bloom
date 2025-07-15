-- Updates brand in translations for emails.

UPDATE translations
SET translations = jsonb_set(translations, '{header}', '{"logoUrl": "https://detroitmi.gov/themes/custom/detroitminew/logo.svg", "logoTitle": "Detroit Home Connect"}')
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{footer,footer}', '"Detroit Home Connect"')
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{forgotPassword,resetRequest}', '"A request to reset your Detroit Home Connect website password for %{appUrl} has recently been made."')
WHERE language = 'en';

-- update en + es
UPDATE translations
SET translations = jsonb_set(translations, '{footer,line1}', '"Detroit"');
