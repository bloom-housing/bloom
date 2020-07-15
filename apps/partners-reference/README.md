# Bloom Partners Web Interface

This is a reference implementation of the partners-facing web app, providing the UI for all of the administrative functions for affordable housing partners using Bloom-based systems. Partners include housing developers, property managers, cities, and counties.

## What does this do?

- Allows property managers to view the applications submitted for their listings.

## Getting Started

- `yarn install`
- Copy `.env.template` to `.env.local` and edit variables appropriate to your local environment. S[ee the docs here](https://nextjs.org/docs/basic-features/environment-variables) for more detail on configuration options.
- `yarn dev`

## Running end-to-end tests locally

- Start the Next.js server: `yarn test`
- In the Cypress app, click on the test called "our_first_test.spec.js". This will open the Cypress test runner in a Chrome browser and run the test.
