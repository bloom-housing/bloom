# Bloom Partners Application

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e) ![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

This is the reference implementation of our partners web app, providing the UI for all of the administrative functions for affordable housing partners including managing applications and listings. Partners include housing developers, property managers, cities, and counties. You can read more about the product at [bloomhousing.com](https://bloomhousing.com/).

## Getting Started

The following commands are for macOS / Linux, but you can find equivalent instructions for Windows machines online.

If you don't have yarn installed, you can install homebrew with [these instructions](https://brew.sh/) and then do so with `brew install yarn`.

- `yarn install` at root to install dependencies
- From within `sites/partners` copy the `.env.template` to `.env` and edit variables appropriate to your local environment - some keys are secret and are internally available - the template file includes default values and descriptions of each variable
- `yarn dev:all` at root will start up the backend at port 3100 and the partners app at port 3001

## Tests

For our partners application, our tests currently consist of both a Cypress end to end suite and a jest unit/integration suite.

To run the Cypress suite, with the application already running, run `yarn test` from within `sites/partners`.

To run the unit/integration suite, run `yarn test:unit` from within `sites/partners`, or `yarn test:unit:coverage` to run with coverage reports.
