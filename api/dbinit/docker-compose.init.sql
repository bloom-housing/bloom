-- Creates the bloom_prisma database and database users.
-- Follows examples from https://aws.amazon.com/blogs/database/managing-postgresql-users-and-roles/.

\set ON_ERROR_STOP on

CREATE DATABASE bloom_prisma;
\c bloom_prisma

-- Revoke public privleges
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE bloom_prisma FROM PUBLIC;

-- Roles
-- bloom_api
CREATE USER bloom_api PASSWORD 'bloom_api_pw';
GRANT CONNECT ON DATABASE bloom_prisma TO bloom_api;
GRANT ALL PRIVILEGES ON DATABASE bloom_prisma TO bloom_api;
GRANT ALL PRIVILEGES ON SCHEMA public TO bloom_api;
-- bloom_readonly
CREATE USER bloom_readonly PASSWORD 'bloom_readonly_pw';
GRANT CONNECT ON DATABASE bloom_prisma TO bloom_readonly;
GRANT USAGE ON SCHEMA public TO bloom_readonly;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO bloom_readonly;

-- Set local role within transation.
BEGIN;
SET LOCAL ROLE bloom_api;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO bloom_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO bloom_readonly;
COMMIT;

