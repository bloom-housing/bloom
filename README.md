# Bloom Affordable Housing System

This is the repository for the Bloom affordable housing system.

## System Overview

Bloom consists of a client/server architecture using [Next.js](https://nextjs.org) (a React-based site framework) for the frontend applications and [NestJS](https://nestjs.com) for the backend API.

The frontend apps can easily be deployed to any Jamstack-friendly web host such as [Netlify](https://www.netlify.com/) or Vercel. The frontend build process performs a static rendering of as much of the React page component trees as possible based on API data available at the time of the build. Additional real-time interactivity is made possible by React components at run-time.

The backend can be simultaneously deployed to PaaS-style hosts such as Heroku. Its primary architectural dependency is a PostgreSQL database.

### Structure

Bloom uses a monorepo-style repository containing multiple user-facing applications and backend services. The three main high-level packages are `api`, `sites`, and `shared-helpers`. Additionally, Bloom's UI leverages the in-house npm package `@bloom-housing/ui-components`.

The `sites` package contains reference implementations for the two user-facing applications in the system:

---

- `sites/public` is the applicant-facing site available to the general public. It provides the ability to browse available listings and to apply for listings either using the Common Application (which we build and maintain) or an external link to a third-party online or paper application.
- Visit [sites/public/README](https://github.com/bloom-housing/bloom/blob/main/sites/public/README.md) for more details.

- `sites/partners` is the site designed for housing developers, property managers, and city/county (jurisdiction) employees. For application management, it offers the ability to view, edit, and export applications for listings and other administrative tasks. For listing management, it offers the ability to create, edit, and publish listings. A login is required to use the Partners Portal.
- Visit [sites/partners/README](https://github.com/bloom-housing/bloom/blob/main/sites/partners/README.md) for more details.

In some cases the sites diverge slightly to accomodate jurisdictional customizations. The [housingbayarea Bloom fork](https://github.com/housingbayarea/bloom) is a fork of Bloom core for Bay Area jurisdictions which is loosely customized for that location. In this fork, our jurisdictions are each a separate branch.

---

- `api` is the container for the key backend services (e.g. listings, applications, users). Information is stored in a Postgres database and served over HTTPS to the front-end (either at build time for things that can be server-rendered, or at run time). Most services are part of a NestJS application which allows for consolidated operation in one runtime environment. Services expose a REST API, and aren't expected to have any UI other than for debugging.
- Visit [api/README](https://github.com/bloom-housing/bloom/blob/main/api/README.md) for more details.

---

- `shared-helpers` contains types and functions intended for shared use between the public and partners sites.
- Visit [shared-helpers/README](https://github.com/bloom-housing/bloom/blob/main/shared-helpers/README.md) for more details.

---

- `@bloom-housing/ui-components` is our component library based on our internal design system. It is comprised of React components that we consume as an npm package and also build to be configurable for outside consumers. We use [Storybook](https://storybook.js.org/), an environment to provide documentation and display iterations. Our published storybook can be found[here](https://storybook.bloom.exygy.dev/) and for further details visit the [ui-components repository](https://github.com/bloom-housing/ui-components).

## Getting Started for Developers

If this is your first time working with Bloom, please be sure to check out the `sites/public`, `sites/partners` and `api` README files for important configuration information specific to those pieces.

## General Local Setup

### Dependencies

```
yarn install
```

### Local environment variables

Configuration of each app and service is read from environment variables. There is an `.env.template` file in each app or service directory that must be copied to `.env` (or equivalent). Some keys are purposefully missing for security concerns and are internally available.

The [CSS variable autocomplete plugin](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-css-variables&ssr=false#overview) will pull in all CSS variable definitions from ui-seeds for autocompletion (more setup instructions in the [public README](https://github.com/bloom-housing/bloom/blob/main/sites/public/README.md)).

The [CSS module autocomplete plugin](https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules) which provides autocomplete for CSS module files.

### Running a local test server

```
yarn dev:all
```

This runs 3 processes for both apps and the backend services on 3 different ports:

- 3000 for the public app
- 3001 for the partners app
- 3100 for api

There is a chance that this won't work on your machine. If that is the case you can run each individually on separate terminals with the following command in each directory.

```
yarn dev
```

### Bloom's UI-Component Development
- Because Bloom's ui-components package is a separate open source repository, developing within both repos locally requires linking the folders with the following steps:
### Directory Setup
1. Clone both Bloom and the [ui-components repository](https://github.com/bloom-housing/ui-components) on the same directory level. 
### Symlinking UI-C
1. In the Bloom directory, run `yarn link:uic`.
2. Open the next.config.js file in the public and partner's directory.
3. Uncomment the experimental property at the bottom of each file.
4. Follow the directions above to run Bloom locally.
These steps allow for two development patterns. You can edit ui-components within the node_modules of Bloom and the changes will be reflected in your local version of ui-components. Alternatively, you can edit the local version of ui-components and the changes will be reflected in the node_modules in Bloom. Both patterns will display up-to-date changes on the local server.

### Unlinking UI-C
1. In the Bloom directory, run `yarn unlink:uic`.
2. Open the next.config.js file in the public and partner's directory.
3. Comment out the experimental property at the bottom of each file.
4. Follow the directions above to run Bloom locally.
Bloom will now be consuming the published version of @bloom-housing/ui-components specified in package.json and no local ui-component changes will be reflected.


## Contributing

Contributions to the core Bloom applications and services are welcomed. To help us meet the project's goals around quality and maintainability, we ask that all contributors read, understand, and agree to our guidelines.

### Issue tracking

Our development tasks are managed through GitHub issues and development in the vast majority of cases should be tied to an issue. Please feel free to submit issues even if you don't plan on implementing it yourself. Before creating an issue, check first to see if one already exists. When creating an issue, give it a descriptive title and include screenshots if relevant. Please don't start work on an issue without checking in with the Bloom team first as it may already be in development! You can tag us (@seanmalbert, @emilyjablonski, @yazeedloonat) to get started on an issue or ask any questions.

### Committing, Versioning, and Releasing

We are using [lerna](https://lerna.js.org/) as a monorepo management tool. It automatically versions, releases, and generates a changelog across our packages. In conjunction with lerna we are also using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), a specification for commit messages that helps lerna understand what level of change each commit is in order to automate our processes.

On commit, two steps automatically run: (1) linting and (2) a verification of the conventional commit standard. We recommend not running `git commit` and instead globally installing commitizen (`npm install -g commitizen`) and then committing with `git cz` which will run a commit message CLI. The CLI asks a series of questions about your changeset and builds the commit message for you in the conventional commit format. You can also `git commit` with your own message if you are confident it follows the conventional standard.

In addition to commits needing to be formatted as conventional commits, if you are making different levels of version change across multiple packages, your commits must also be separated by package in order to avoid improperly versioning a package.

On every merge to `main`, our Netlify and Heroku environment automatically deploys.

### Pull Requests

Pull requests are opened to the main branch. When opening a pull request please fill out the entire pull request template which includes tagging the issue your PR is related to, a description of your PR, indicating the type of change, including details for the reviewer about how to test your PR, and a testing checklist. Additionally, officially link the issue to the PR using GitHub's linking UI.

When your PR is ready for review, add the `needs review(s)` label to help surface it to our internal team. You can assign people as reviewers to surface the work further. If you put up a PR that is not yet ready for eyes, add the `wip` label.

Once the PR has been approved, you either (1) squash and merge the commits if your changes are just in one package, or (2) rebase and merge your commits if your commits are cleanly separated across multiple packages to allow the versions to propagate appropriately.

As a reviewer on a PR, try not to leave only comments, but a clear next step action. If the PR requires further discussion or changes, mark it with Requested Changes. If a PR looks good to you (or even if there are small changes requested that won't require an additional review), please mark it with Approved and comment on the last few changes needed. This helps other reviewers better understand the state of PRs at the list view and prevents an additional unnecessary review cycle.
