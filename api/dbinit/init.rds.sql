CREATE DATABASE bloom_prisma;
\c bloom_prisma

-- bloom_api
CREATE USER bloom_api;
GRANT rds_iam TO bloom_api;
GRANT ALL PRIVILEGES ON DATABASE bloom_prisma TO bloom_api;
GRANT ALL PRIVILEGES ON SCHEMA public TO bloom_api;

-- bloom_readonly
CREATE USER bloom_readonly;
GRANT rds_iam TO bloom_readonly;
ALTER DEFAULT PRIVILEGES FOR USER bloom_api -- setting the defaults for any tables created by bloom_api.
IN SCHEMA public GRANT SELECT ON TABLES TO bloom_readonly;
