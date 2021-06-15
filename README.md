# Bloom Affordable Housing System

This is the repository for the Bloom affordable housing system.

## System Overview

Bloom consists of a client/server architecture using [Next.js](https://nextjs.org) (a React-based site framework) for the frontend applications and [NestJS](https://nestjs.com) for the backend API.

The frontend apps can easily be deployed to any Jamstack-friendly web host such as Netlify or Vercel. The frontend build process performs a static rendering of as much of the React page component trees as possible based on API data available at the time of the build. Additional real-time interactivity is made possible by React components at run-time.

The backend can be simultaenously deployed to PaaS-style hosts such as Heroku. Its primary architectural dependency is a PostgreSQL database.

### Applications

This repository contains refence implementations for each of the two main user-facing applications in the system:

- `sites/public` is the applicant-facing site available to the general public. It provides the ability to browse available listings, and to apply for listings either using the Common Application or an external link to an online or PDF application.

- `sites/partners` is the site designed for housing developers, property managers, and city/county (jurisdiction) employees. It will offer the ability to view and edit listings, view applications, and other administrative activities. A login is required to use the Partners Portal.

Each application is designed to run entirely in the browser, and to only serve as a baseline for the customized site specific to each jurisdiction. See the [housingbayarea Bloom fork](https://github.com/housingbayarea/bloom) for an example with customized sites.

### Services

- `backend/core` will be the container for the key backend services (e.g. listings, applications, users) going forward. Information is stored in a postgres database, and served over HTTPS to the front-end (either at build time for things that can be server-rendered, or at run time).

### Shared Libraries

- `ui-components` Contains shared UI components that are shared between applications and meant to be easily imported to implementation-specific sites without customization. Pull Requests to improve UI components in a generalized way are welcomed.

## Getting Started for Developers

Bloom uses a monorepo-style repository, containing multiple user-facing applications and back-end services. Most services are part of a consolidated NestJS application in `backend/core`, which allows for easy consolidated operation in one runtime environment. Services expose a REST API, and aren't expected to have any UI other than for debugging.

If this is your first time working with Bloom, please be sure to check out the app and service README files as well for important configuration information specific to those pieces.

### Installing Dependencies

```
yarn install
```

### Setting up your local environment variables

Operational configuration of each app and service is read from environment variables. There is a `.env.template` file in each app or service directory that must be copied to `.env` (or equivalent), and the settings modified specific to your development environment.

### Setting up a test Database

The new `backend/core` uses a postgres database, which is accessed via TypeORM. Once postgres is set up and a blank database is initialized, yarn scripts are available within that package to create/migrate the schema, and to seed the database for development and testing. See [backend/core/README.md](https://github.com/bloom-housing/bloom/blob/master/backend/core/README.md) for more details.

### Running a Local Test Server

```
yarn dev:all
```

This runs 4 processes for each of the two apps and two services on 4 different ports:

- 3000 for the Public app
- 3001 for the Partners app
- 3100 for the new backend/core

### Storybook Component Library

The `ui-components` package includes [Storybook](https://storybook.js.org/), an environment for easily browing the UI components independent of their implementation. Storybook can be run locally with `yarn start` from within the `ui-components` directory. Contributions to component stories are highly encouraged, and will also benefit testing coverage via Storyshots. See [backend/core/README.md](https://github.com/bloom-housing/bloom/blob/master/ui-components/README.md) for more details.

### Running Tests

```
yarn test:all
```

### Adding a new app

1. Duplicate the [public](sites/public) directory to `sites/<your-app-name>`
1. Change all usages of `public` in `sites/<your-app-name>/package.json` to `<your-app-name>`
1. Update root-level [package.json](package.json)
   - Add `<your-app-name>` to the `workspaces.packages` list
   - Add yarn scripts for your new app
     - ex build script: `"dev:app:<myapp>": "wait-on \"http://localhost:${PORT:-3001}/\" && cd sites/<your-app-name> && yarn dev"`
     - ex test script: `"test:app:<myapp>": "wait-on \"http://localhost:${PORT:-3001}/\" && cd sites/<your-app-name> && yarn test"`
1. Run `yarn install` and now you should be able to build your app with `yarn dev:app:<myapp>`

### Versioning

We are using [lerna](https://lerna.js.org/) as a package versioning tool. It helps with keeping multiple package versions in sync for the entire monorepo.

## Contributing

Contributions to the core Bloom applications and services are welcomed. To help us meet the project's goals around quality and maintainability, we ask that all contributors read, understand, and agree to these guidelines.

## Pulling changes from core repository

Add a new remote origin:

```
git remote add upstream https://github.com/bloom-housing/bloom.git
```

Fetch newest indices from it:

```
git fetch upstream
```

Merge remote into your local branch:

```
git merge upstream/master
``
