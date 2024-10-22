# Bloom Partners Application

This is the reference implementation of our partners web app, providing the UI for all of the administrative functions for affordable housing partners including managing applications and listings. Partners include housing developers, property managers, cities, and counties.

## Getting Started

- `yarn install` at root to install dependencies
- From within `sites/partners` copy the `.env.template` to `.env` and edit variables appropriate to your local environment - some keys are secret and are internally available - the template file includes default values and descriptions of each variable
- `yarn dev:all` at root will start up the backend at port 3100 and the partners app at port 3001

## Tests

For our partners application, our tests currently conist of both a Cypress end to end suite and a jest unit/integration suite.

To run the Cypress suite, with the application already running, run `yarn test` from within `sites/public`.

To run the unit/integration suite, run `yarn test:unit` from within `sites/public`.
