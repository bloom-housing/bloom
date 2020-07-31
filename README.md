# Bloom Affordable Housing System

This is the repository for the Bloom affordable housing system.

## System Overview

An overview of the system will go here.

### Applications

### Services

### Shared Libraries

- UI Components
- Styles

## Getting Started for Developers

Bloom uses a monorepo-style repository, containing multiple user-facing applications and back-end services. Services expose a REST API, and aren't expected to have any UI other than for debugging.

If this is your first time working with Bloom, please be sure to check out the individual app and service README files as well for important configuration information specific to those pieces.

### Installing Dependencies

```
yarn install
```

### Setting up a test Database

N/A for the time being.

### Running a Local Test Server

```
yarn dev:all
```

### Running Tests

```
yarn test:all
```

### Adding a new app
1. Duplicate the [public-reference](apps/public-reference) directory to `apps/<your-app-name>`
1. Change all usages of `public-reference` in `apps/<your-app-name>/package.json` to `<your-app-name>`
1. Update root-level [package.json](package.json)
  - Add `<your-app-name>` to the `workspaces.packages` list
  - Add yarn scripts for your new app
    - ex build script: `"dev:app:<myapp>": "wait-on \"http://localhost:${PORT:-3001}/\" && cd apps/<your-app-name> && yarn dev"`
    - ex test script: `"test:app:<myapp>": "wait-on \"http://localhost:${PORT:-3001}/\" && cd apps/<your-app-name> && yarn test"`
1. Run `yarn install` and now you should be able to build your app with `yarn dev:app:<myapp>`

### Versioning

We are using [lerna](https://lerna.js.org/) as a package versioning tool. It helps with keeping multiple package versions in sync.
To upgrade version, first commit your changes to feature branch and push it to github. Then run
```
yarn new-version
```
It will upgrade dependencies, commit them to github and create a release with a tag.

## Contributing

Contributions to the core Bloom applications and services are welcomed. To help us meet the project's goals around quality and maintainability, we ask that all contributors read, understand, and agree to these guidelines.
