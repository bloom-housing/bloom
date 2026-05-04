INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Healthcare in Action',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Cardin Healthcare',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'St. Vincent Preventative Family Care',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Serene Health Group',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'To Help Everyone',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Hollidays Helping Hands',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';