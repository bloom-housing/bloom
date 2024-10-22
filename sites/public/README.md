# Bloom Public Application

This is the reference implementation of our public-facing web app. It displays listings and allows users to apply for those listings. Users are also able to create accounts they can use to view submitted applications.

## Getting Started

- `yarn install` at root to install dependencies
- From within `sites/public` copy the `.env.template` to `.env` and edit variables appropriate to your local environment - some keys are secret and are internally available - the template file includes default values and descriptions of each variable
- `yarn dev:all` at root will start up the backend at port 3100 and the public app at port 3000

## Tests

For our public application, our tests currently conist of both a Cypress end to end suite and a jest unit/integration suite.

To run the Cypress suite, with the application already running, run `yarn test` from within `sites/public`.

To run the unit/integration suite, run `yarn test:unit` from within `sites/public`.
