# Deploying Bloom Services to Heroku

Bloom is designed to use a set of independently run services that provide the data and business logic processing needed by the front-end apps. While the Bloom architecture accomodates services built and operated in a variety of environments, the reference implementation includes services that can be easily run within the [Heroku PaaS environment](https://www.heroku.com/).

## Monorepo Buildpack

Since the Bloom repository uses a monorepo layout, all Heroku services must use the [monorepo buildpack](https://elements.heroku.com/buildpacks/lstoll/heroku-buildpack-monorepo).

## Procfile

## Environment Variables