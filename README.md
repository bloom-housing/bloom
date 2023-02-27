# Bloom Affordable Housing System

This is the repository for the Bloom affordable housing system.

## System Overview

Bloom consists of a client/server architecture using [Next.js](https://nextjs.org) (a React-based site framework) for the frontend applications and [NestJS](https://nestjs.com) for the backend API.

The frontend apps can easily be deployed to any Jamstack-friendly web host such as [Netlify](https://www.netlify.com/) or Vercel. The frontend build process performs a static rendering of as much of the React page component trees as possible based on API data available at the time of the build. Additional real-time interactivity is made possible by React components at run-time.

The backend can be simultaenously deployed to PaaS-style hosts such as Heroku. Its primary architectural dependency is a PostgreSQL database.

### Structure

Bloom uses a monorepo-style repository containing multiple user-facing applications and backend services. The three main high-level packages are `backend/core`, `sites`, `ui-components`, and `shared-helpers`.

The `sites` package contains reference implementations for the two user-facing applications in the system:

---

- `sites/public` is the applicant-facing site available to the general public. It provides the ability to browse available listings and to apply for listings either using the Common Application (which we build and maintain) or an external link to a third-party online or paper application.
- Visit [sites/public/README](https://github.com/bloom-housing/bloom/blob/dev/sites/public/README.md) for more details.

- `sites/partners` is the site designed for housing developers, property managers, and city/county (jurisdiction) employees. For application management, it offers the ability to view, edit, and export applications for listings and other administrative tasks. For listing management, it offers the ability to create, edit, and publish listings. A login is required to use the Partners Portal.
- Visit [sites/partners/README](https://github.com/bloom-housing/bloom/blob/dev/sites/partners/README.md) for more details.

In some cases the sites diverge slightly to accomodate jurisdictional customizations. The [housingbayarea Bloom fork](https://github.com/housingbayarea/bloom) is a fork of Bloom core for Bay Area jurisdictions which is loosely customized for that location. In this fork, our jurisdictions are each a separate branch.

---

- `backend/core` is the container for the key backend services (e.g. listings, applications, users). Information is stored in a Postgres database and served over HTTPS to the front-end (either at build time for things that can be server-rendered, or at run time). Most services are part of a NestJS application which allows for consolidated operation in one runtime environment. Services expose a REST API, and aren't expected to have any UI other than for debugging.
- Visit [backend/core/README](https://github.com/bloom-housing/bloom/blob/dev/backend/core/README.md) for more details.

---

- `shared-helpers` contains types and functions intended for shared use between the public and partners sites.
- Visit [shared-helpers/README](https://github.com/bloom-housing/bloom/blob/dev/shared-helpers/README.md) for more details.

---

- `detroit-ui-components` contains our internal component library based on our internal design system. It is comprised of React components that we consume internally and also build to be configurable for outside consumers. We use [Storybook](https://storybook.js.org/), an environment that renders each of our components to provide documentation and display iterations.
- Visit [ui-components/README](https://github.com/bloom-housing/bloom/blob/dev/ui-components/README.md) for more details and view our [published Storybook](https://storybook.bloom.exygy.dev/).

## Getting Started for Developers

If this is your first time working with Bloom, please be sure to check out the `sites/public`, `sites/partners` and `backend/core` README files for important configuration information specific to those pieces.

## General Local Setup

### Dependencies

```
yarn install
```

### Local environment variables

Configuration of each app and service is read from environment variables. There is an `.env.template` file in each app or service directory that must be copied to `.env` (or equivalent). Some keys are purposefully missing for security concerns and are internally available.

### Installing Dependencies and Seeding the Database

This alias does a `yarn:install` in the root of the repo and `yarn install` and `yarn db:reseed` in the `backend/core` dir.

```
yarn setup
```

### Setting up a test Database

The new `backend/core` uses a postgres database, which is accessed via TypeORM. Once postgres is set up and a blank database is initialized, yarn scripts are available within that package to create/migrate the schema, and to seed the database for development and testing. See [backend/core/README.md](https://github.com/bloom-housing/bloom/blob/master/backend/core/README.md) for more details.

### Running a Local Test Server

```
yarn dev:all
```

This runs 3 processes for both apps and the backend services on 3 different ports:

- 3000 for the public app
- 3001 for the partners app
- 3100 for backend/core

## Contributing

Contributions to the core Bloom applications and services are welcomed. To help us meet the project's goals around quality and maintainability, we ask that all contributors read, understand, and agree to our guidelines.

### Issue tracking

Our development tasks are managed through GitHub issues and any development (in the vast majority of cases) should be tied to an issue. Please feel free to submit issues even if you don't plan on implementing it yourself. Before creating an issue, check first to see if one already exists. When creating an issue, give it a descriptive title and include screenshots if relevant. Please don't start work on an issue without checking in with the Bloom team first as it may already be in development! You can tag us (@seanmalbert, @emilyjablonski, @yazeedloonat) to get started on an issue or ask any questions.

### Committing, Versioning, and Releasing

We are using [lerna](https://lerna.js.org/) as a monorepo management tool. It automatically versions, releases, and generates a changelog across our packages. In conjunction with lerna we are also using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), a specification for commit messages that helps lerna understand what level of change each commit is in order to automate our processes.

On commit, two steps automatically run: (1) linting and (2) a verification of the conventional commit standard. We recommend not running `git commit` and instead globally installing commitizen (`npm install -g commitizen`) and then committing with `git cz` which will run a commit message CLI. The CLI asks a series of questions about your changeset and builds the commit message for you in the conventional commit format. You can also `git commit` with your own message if you are confident it follows the conventional standard.

In addition to commits needing to be formatted as conventional commits, if you are making different levels of version change across multiple packages, your commits must also be separated by package in order to avoid improperly versioning a package.

On every merge to dev, our Netlify `development` environment is updated and a pre-release of the ui-components package is automatically published to npm.

On every merge to master (roughly bi-weekly), a release of the backend/core and ui-components packages are automatically published to npm and our Netlify `staging` environment is updated.

Once staging has been QAed, we manually update `production`.

### Pull Requests

Pull requests are opened to the dev branch, not to master. When opening a pull request please fill out the entire pull request template which includes tagging the issue your PR is related to, a description of your PR, indicating the type of change, including details for the reviewer about how to test your PR, and a testing checklist. Additionally, officially link the issue to the PR using GitHub's linking UI.

When your PR is ready for review, add the `needs review(s)` label to help surface it to our internal team. You can assign people as reviewers to surface the work further. If you put up a PR that is not yet ready for eyes, add the `wip` label.

Once the PR has been approved, you either (1) squash and merge the commits if your changes are just in one package, or (2) rebase and merge your commits if your commits are cleanly separated across multiple packages to allow the versions to propagate appropriately.

As a reviewer on a PR, try not to leave only comments, but a clear next step action. If the PR requires further discussion or changes, mark it with Requested Changes. If a PR looks good to you (or even if there are small changes requested that won't require an additional review), please mark it with Approved and comment on the last few changes needed. This helps other reviewers better understand the state of PRs at the list view and prevents an additional unnecessary review cycle.
