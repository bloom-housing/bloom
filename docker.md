# Docker and Bloom

## Local development

When developing Bloom locally it is beneficial to run it in an isolated environment that is more similar to a deployed environment. This is where utilizing Docker can come in to better simulate a containerized version of the application while still giving the flexibility to continue to make changes.

### Prerequisites

#### Docker Desktop

In order to use docker locally you have to have docker installed. It is recommended to use [Docker Desktop](https://www.docker.com/products/docker-desktop/) but not required.

### Just running postgres

A convient way to have postgres running locally is to utilize this [docker compose file](docker-compose-postgres.yml). By running the following command a postgres instance is created within docker.
`docker compose -f docker-compose-postgres.yml up --build -d`

To use this database the api .env file will need to be updated accordingly `DATABASE_URL="postgresql://postgres:prisma@localhost:5433/bloom_prisma"`

Note: On some mac devices localhost will not work so it will have to be `DATABASE_URL=postgresql://postgres:prisma@docker.for.mac.host.internal:5433/bloom_prisma`

### Full bloom application

The entire Bloom application can also be run via this [docker compose file](docker-compose-full.yml). This starts up a database, the api, the partner site, and the public site all within docker. The application is still in dev mode so any changes will be picked up without needing to restart. The backend also re-seeds the database on startup.

This setup still uses the `.env` files from the respective packages. Any changes to those files will need a restart of the application to be picked up. Take note of the required changes for the database url in the above section.

#### Command to start:

`docker compose -f docker-compose-full.yml up --build -d`

#### Command to shut down:

It is recommended to use this command to bring down the running instances so that everything is properly shut down.
`docker compose -f docker-compose-full.yml down --remove-orphans`

## Production images

Bloom is setup to be deployable in cloud environments via docker images. Those images can be built and run locally.

### Backend

For a full view into the docker steps you can find the details in this [DockerFile](api/Dockerfile)

### "Run" image

This is the image that runs the `api` code and in production would be the instance that all requests to the backend would hit.

#### Build

The following command should be run in the `api` directory to build the image
`docker build . -f Dockerfile --target run -t backend`

#### Run

After the image is built, the following command should be run from the `api` directory. Make sure you have postgres running either locally or with docker-compose [mentioned above](#just-running-postgres). Note that it grabs the environment variables directly from your local `.env` file. If any variable value needs to be changed you will need to stop the running container and re-run the command after the variable is updated.
`docker run  --env-file .env -p 3100:3100 --name backend backend`

### "Migrate" image

In order to run migrations in a production environment we have elected to create a separate image that has the sole purpose of running the postgres migrations. This is also located in the same Dockerfile as the run image.

#### Build

The following command should be run in the `api` directory to build the image
`docker build . -f Dockerfile --target migrate -t backend-migrate`

#### Run

After the image is built, the following command should be run from the `api` directory. It will run all of the pending migrations on the postgres defined at `DATABASE_URL` in the `.env` file
`docker run  --env-file .env --name backend-migrate backend-migrate`
