# Deploying Bloom Services to Heroku

Bloom is designed to use a set of independently run services that provide the data and business logic processing needed by the front-end apps. While the Bloom architecture accomodates services built and operated in a variety of environments, the reference implementation includes services that can be easily run within the [Heroku PaaS environment](https://www.heroku.com/).

## Resources
- [Heroku Postgres](https://www.heroku.com/postgres)
- [Heroku Redis](https://www.heroku.com/redis)

## Heroku Buildpacks

### Monorepo Buildpack

Since the Bloom repository uses a monorepo layout, all Heroku services must use the [monorepo buildpack](https://elements.heroku.com/buildpacks/lstoll/heroku-buildpack-monorepo).

### Node.js Buildpack

Bloom's backend runs on Node.js and Heroku must be setup with [Heroku Buildpack for Node.js](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-nodejs).

## Procfile
release: yarn herokusetup

web: yarn start

## Environment Variables

APP_BASE=backend/core

APP_SECRET='YOUR-LONG-SECRET-KEY'

CLOUDINARY_SECRET=

CLOUDINARY_KEY=

DATABASE_URL=

EMAIL_API_KEY='SENDGRID-API-KEY'

EMAIL_FROM_ADDRESS=

PARTNERS_BASE_URL='PARTNER-PORTAL-URL'

REDIS_TLS_URL=

REDIS_URL=

REDIS_USE_TLS=1
