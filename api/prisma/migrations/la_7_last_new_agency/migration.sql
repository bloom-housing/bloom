INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Los Angeles House of Ruth',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';
