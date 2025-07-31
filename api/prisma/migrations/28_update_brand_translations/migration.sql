-- Updates brand in translations for emails.

UPDATE translations
SET translations = jsonb_set(translations, '{header}', '{"logoUrl": "https://detroitmi.gov/themes/custom/detroitminew/logo.svg", "logoTitle": "Detroit Home Connect"}')
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{footer,footer}', '"City of Detroit Housing and Revitalization Department"')
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{footer,line1}', '"City of Detroit Housing and Revitalization Department"')
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{footer,line2}', '""')
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{invite,inviteMessage}', '"Welcome to the Partners Portal on %{appUrl}."')
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{invite.inviteManageListings}', '"You will now be able to manage listings and applications that you are a part of from one centralized location."')
WHERE language = 'en';
