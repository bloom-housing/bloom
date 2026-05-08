INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'The Sidewalk Project',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Central Neighborhood Christian Health Clinics',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';


INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Charmaney''s Place of Refuge Resource Center Inc.',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';
