-- Adds new single-use code translations for emails.

UPDATE translations
SET translations = jsonb_set(translations, '{singleUseCodeEmail}', '{"greeting": "Hi","message": "Use the following code to sign in to your %{jurisdictionName} account. This code will be valid for 5 minutes. Never share this code.","singleUseCode": "%{singleUseCode}"}')
WHERE jurisdiction_id IS NULL
    and language = 'en';

UPDATE translations
    SET translations = jsonb_set(translations, '{mfaCodeEmail, mfaCode}', '{"mfaCode": "Your access code is: %{singleUseCode}"}')
WHERE language = 'en';
