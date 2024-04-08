-- Updates single-use code translations for emails.

UPDATE translations
SET translations = jsonb_set(translations, '{singleUseCodeUpdateEmail}', '{"greeting": "Hi","message": "Use the following code to confirm an email update to your %{jurisdictionName} account. This code will be valid for 5 minutes. Never share this code.","singleUseCode": "%{singleUseCode}"}')
WHERE jurisdiction_id IS NULL
    and language = 'en';

