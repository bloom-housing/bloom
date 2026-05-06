INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Titanium Healthcare',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Jewish Family Service Los Angeles',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Independent Living Systems, LLC',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Karsh Family Social Service Center',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'Mercedez Diaz Homes',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    '211LA',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';

INSERT INTO agency (created_at, updated_at, name, jurisdictions_id)
SELECT
    now(),
    now(),
    'National Council on Alcohol and Drug Dependence of the San Fernando Valley',
    id
FROM jurisdictions
WHERE name = 'Los Angeles';
