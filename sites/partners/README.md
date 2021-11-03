# Bloom Partners Application

This is the reference implementation of our partners web app, providing the UI for all of the administrative functions for affordable housing partners using Bloom-based systems (managing applications, and soon publishing listings). Partners include housing developers, property managers, cities, and counties.

## Getting Started

All from within `sites/partners`:

- `yarn install` to install dependencies
- Copy the `.env.template` to `.env` and edit variables appropriate to your local environment
- `yarn dev:all` will start up the backend at port 3100 and the partners app at port 3001

## Tests

For our partnres application, our tests currently consistent of a Cypress integration test suite. We are looking to add React Testing Library unit tests soon.

To run the Cypress suite, with the application running, run `yarn test` from within `sites/partners` and when the test runner in a Chrome browser opens, click on whichever suite you want to run.

## Environment Variables

| Name                     | Description                                                                                                                             | Default               | Type    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------- |
| BACKEND_API_BASE         | URL pointing to a working NestJS bloom server (no trailing slash)                                                                       | http://localhost:3100 | string  |
| NEXTJS_PORT              | Defines port number the server will listen to for incoming connections                                                                  | 3001                  | number  |
| LISTINGS_QUERY           | Value specifying what path to use to fetch listings at build time for static serving (?)                                                | /listings             | string  |
| SHOW_DUPLICATES          | Toggles the duplicate application feature on/off                                                                                        | false                 | boolean |
| SHOW_LM_LINKS            | Toggles the listings management button on/off                                                                                           | true                  | boolean |
| MAPBOX_TOKEN             | Access token used for interacting with maps. See more documentation [here](https://docs.mapbox.com/help/getting-started/access-tokens/) | Available internally  | string  |
| CLOUDINARY_CLOUD_NAME    | Used for features that upload files/images                                                                                              | exygy                 | string  |
| CLOUDINARY_KEY           | Used for features that upload files/images, access token                                                                                | Available internally  | string  |
| CLOUDINARY_SIGNED_PRESET | Used for features that upload files/images, access token                                                                                | Available internally  | string  |
