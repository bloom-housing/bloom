-- Update single-use code expiration translations
UPDATE translations
SET translations = jsonb_set(translations, '{singleUseCodeEmail}', '{"greeting": "Hi","message": "Use the following code to sign in to your %{jurisdictionName} account. This code will be valid for 10 minutes. Never share this code.","singleUseCode": "%{singleUseCode}"}')
WHERE jurisdiction_id IS NULL
    and language = 'en';