# Listings Import Task

This code provides a mechanism for pulling listings from a different Bloom backend and loading them into the `external_listings` table in a Postgres database. It is intended to be run on a periodic basis as a fully independent process and has no code dependencies on any other packages within this repo. The import process is fully atomic; it either imports all listings pulled from the external backend or it leaves the database in the state it was prior to running.

## Environment Variables

| Name                       | Description                                                       | Example                                         | Default        | Type                   |
| -------------------------- | ----------------------------------------------------------------- | ----------------------------------------------- | -------------- | ---------------------- |
| DATABASE_URL               | The URI for the database to import listings into                  | postgres://bloom-dev:bloom@localhost:5432/bloom |                | string                 |
| EXTERNAL_API_BASE          | The URL base (proto + host) for the backend to pull listings from | https://api.bloom.example                       |                | string                 |
| LISTINGS_ENDPOINT_PATH     | The path to the listings endpoint                                 | /listings                                       | /listings      | string                 |
| JURISDICTION_ENDPOINT_PATH | The path to the jurisdictions endpoint                            | /jurisdictions                                  | /jurisdictions | string                 |
| JURISDICTION_INCLUDE_LIST  | The names of jurisdictions to import listings from                | San Jose,San Mateo,Alameda                      |                | comma-delimited string |
| LISTING_VIEW               | The listing view to request from the endpoint                     | base                                            | base           | "base" \| "full"       |

## Commands

### Install/Build

Install dependencies using `yarn install`, then build the output artifacts using `yarn build`.

### Linting

Linting is handled separately from the rest of the codebase to speed up the lint process and improve the developer experience. Run `yarn lint` to lint just the code in this directory.

### Testing

To run unit tests, run `yarn test`. If you want to output coverage info, run `yarn test:cov`.

### Running the import

There are a few ways you can run the import directly. An example command for the most basic execution might look something like this:

```
DATABASE_URL=postgres://bloom-dev:bloom@localhost:5432/bloom \
EXTERNAL_API_BASE=https://api.housingbayarea.bloom.exygy.dev \
JURISDICTION_INCLUDE_LIST="San Jose,San Mateo,Alameda" \
LISTING_VIEW=full \
yarn import:run
```

There are also shortcut commands to run the import using established presets. Run `yarn import:run:local:dev` to import listings from a predetermined dev environment or `yarn import:run:local:prod` to import listings from a predetermined production environment.

## Docker

Docker builds are handled automatically by AWS CodePipeline using the buildspec file in `ci/buildspec/build_import_listings.yml`, but you can manually build and run this task as a Docker image using the instructions below.

### Running unit tests

From within this directory, run the command below to build an image that can run unit tests. This will build a local image named `doorway/import-listings` with the tag `test`.

`docker build --target test -t doorway/import-listings:test .`

Once the image is built, execute this command to run unit tests.

`docker run doorway/import-listings:test`

If you want to run different tests (ie to generate coverage metrics), pass in the desired command at the end like this:  
`docker run doorway/import-listings:test yarn test:cov`

### Running the import

From within this directory, run the command below to build an image that can run the import task. This will build a local image named `doorway/import-listings` with the tag `run`.

`docker build --target run -t doorway/import-listings:run .`

Running a container with this image will require environmental variables, so either pass them in directly or put them into an env file.v

`docker run -e .env doorway/import-listings:run`

Calling without a specified command will run `yarn import:run` by default. To run a different command, pass it in at the end like this:

`docker run doorway/import-listings:run yarn import:run:local:dev`
