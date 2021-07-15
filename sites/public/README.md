# Bloom Public Web Interface

This is the beginning of a reference implementation of the public-facing web app.

## What does this do?

- Shows listings

## Getting Started

- `yarn install`
- Copy `.env.template` to `.env.local` and edit variables appropriate to your local environment. S[ee the docs here](https://nextjs.org/docs/basic-features/environment-variables) for more detail on configuration options.
- `yarn dev`

### Debugging
Starting the site with `yarn dev` includes the necessary debug flags.

To connect to it from VS Code, add a configuration to launch.json that looks like
```shell script
{
  "name": "Attach to Public Site",
  "port": 9230,
  "request": "attach",
  "skipFiles": [
    "<node_internals>/**"
  ],
  "type": "node",
  "restart": true,
  "sourceMaps": true,
  "cwd": "${workspaceFolder}/sites/public"
},
```

## Running end-to-end tests locally

- Start the Next.js server: `yarn test`
- In the Cypress app, click on the test called "our_first_test.spec.js". This will open the Cypress test runner in a Chrome browser and run the test.
