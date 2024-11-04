# Bloom Public Application

This is the reference implementation of our public-facing web app. It displays listings and allows users to apply for those listings. Users are also able to create accounts with which they can view the applications they have submitted.

## Getting Started

All from within `sites/public`:

- `yarn install`to install dependencies
- Copy the `.env.template` to `.env` and edit variables appropriate to your local environment
- `yarn dev:all` will start up the backend at port 3100 and the public app at port 3000

## Recommended Extension

If you're using VSCode, the [CSS variable autocomplete plugin](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-css-variables&ssr=false#overview) will pull in all CSS variable definitions from ui-seeds for autocompletion.

After installing the extension, ⌘⇧P Open User Settings (JSON), and add the following configuration:

```
  "cssVariables.blacklistFolders": [
    "**/.git",
    "**/.svn",
    "**/.hg",
    "**/CVS",
    "**/.DS_Store",
    "**/bower_components",
    "**/tmp",
    "**/dist",
    "**/tests",
    "**/node_modules/^(?!@bloom-housing).*/m"
  ],
  "cssVariables.lookupFiles": [
    "**/*.css",
    "**/*.scss",
    "**/*.sass",
    "**/*.less",
    "node_modules/@bloom-housing/ui-seeds/src/**/*.scss"
  ]
  ```

## Tests

For our public application, our tests currently consistent of a Cypress integration test suite. We are looking to add React Testing Library unit tests soon.

To run the Cypress suite, with the application running, run `yarn test` from within `sites/public` and when the test runner in a Chrome browser opens, click on whichever suite you want to run.

## Environment Variables

| Name                          | Description                                                                                                                                    | Default                                                                                                                   | Type                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --- | ------ |
| BACKEND_API_BASE              | URL pointing to a working NestJS bloom server (no trailing slash)                                                                              | http://localhost:3100                                                                                                     | string                                 |
| LISTINGS_QUERY                | Value specifying what path to use to fetch listings at build time for static serving                                                           | /listings                                                                                                                 | string                                 |
| HOUSING_COUNSELOR_SERVICE_URL | If this is set, we show a link to this URL in the site header labelled "Get Assistance"                                                        | https://housing.sfgov.org/assets/housing_counselors-7b0f260dac22dfa20871edd36135b62f1a25a9dad78faf2cf8e8e2514b80cf61.json | string                                 |
| NEXTJS_PORT                   | Defines port number the server will listen to for incoming connections                                                                         | 3000                                                                                                                      | number                                 |
| MAPBOX_TOKEN                  | Mapbox access token used for interacting with maps. See more documentation [here](https://docs.mapbox.com/help/getting-started/access-tokens/) | Available internally                                                                                                      | string                                 |
| LANGUAGES                     | Controls what languages Next will try to render on the page                                                                                    | en,es,zh,vi                                                                                                               | string                                 |     | number |
| JURISDICTION_NAME             | Defines an identifier sent along with XHR requests for the backend to identify the current jurisdiction                                        | Alameda                                                                                                                   | "Alameda" \| "San Jose" \| "San Mateo" |
| GTM_KEY                       | Refer to [analytics docs](https://github.com/bloom-housing/bloom/blob/master/docs/Analytics.md)                                                | GTM-KF22FJP                                                                                                               | string                                 |
