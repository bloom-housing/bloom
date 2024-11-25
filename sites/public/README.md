# Bloom Public Application

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e) ![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

This is the reference implementation of our public-facing portal. It displays listings and allows users to apply for those listings. Users are also able to create accounts they can use to view submitted applications. You can read more about the product at [bloomhousing.com](https://bloomhousing.com/).

## Getting Started

The following commands are for macOS / Linux, but you can find equivalent instructions for Windows machines online.

If you don't have yarn installed, you can install homebrew with [these instructions](https://brew.sh/) and then do so with `brew install yarn`.

- `yarn install` at root to install dependencies
- From within `sites/public` copy the `.env.template` to `.env` and edit variables appropriate to your local environment - some keys are secret and are internally available - the template file includes default values and descriptions of each variable
- `yarn dev:all` at root will start up the backend at port 3100 and the public app at port 3000

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

For our public application, our tests currently consist of both a Cypress end to end suite and a jest unit/integration suite.

To run the Cypress suite, with the application already running, run `yarn test` from within `sites/public`.

To run the unit/integration suite, run `yarn test:unit` from within `sites/public`, or `yarn test:unit:coverage` to run with coverage reports.
