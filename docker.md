# Docker and Bloom

## Local development

When developing Bloom locally it is beneficial to run it in an isolated environment that is more similar to a deployed environment. This is where utilizing Docker can come in to better simulate a containerized version of the application.

### Prerequisites

#### Docker Desktop

In order to use docker locally you have to have docker installed. It is recommended to use [Docker Desktop](https://www.docker.com/products/docker-desktop/) but not required.

### Just running postgres

A convient way to have postgres running locally is to utilize this [docker compose file](https://github.com/bloom-housing/bloom/blob/main/docker-compose-postgres.yml). By running the following command a postgres instance is created within docker.
`docker compose -f docker-compose-postgres.yml up --build -d`

To use this database the api .env file will need to be updated accordingly `DATABASE_URL="postgresql://postgres:prisma@localhost:5433/bloom_prisma"`

Note: On some mac devices localhost will not work so it will have to be `DATABASE_URL=postgresql://postgres:prisma@docker.for.mac.host.internal:5433/bloom_prisma`

### Full bloom application

The entire Bloom application can also be run via a docker compose script. This starts up a database, the api, the partner site, and the public site all within docker. The application is still in dev mode so any changes will be picked up without needing to restart. The backend also re-seeds the database on startup.

This setup still uses the `.env` files from the respective packages. Any changes to those files will need a restart of the application to be picked up. Take note of the required changes for the database url in the above section.

#### Command to start:

`docker compose -f docker-compose-full.yml up --build -d`

#### Command to shut down:

It is recommended to use this command to bring down the running instances so that everything is properly shut down.
`docker compose -f docker-compose-full.yml down --remove-orphans`
