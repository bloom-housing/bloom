# Bloom Affordable Housing System

This is the repository for the Bloom affordable housing system.

## System Overview

Bloom consists of a client/server architecture using [Next.js](https://nextjs.org) (a React-based site framework) for the frontend applications and [NestJS](https://nestjs.com) for the backend API.

The frontend apps can easily be deployed to any Jamstack-friendly web host such as Netlify or Vercel. The frontend build process performs a static rendering of as much of the React page component trees as possible based on API data available at the time of the build. Additional real-time interactivity is made possible by React components at run-time.

The backend can be simultaenously deployed to PaaS-style hosts such as Heroku. Its primary architectural dependency is a PostgreSQL database.

### Structure

Bloom uses a monorepo-style repository, containing multiple user-facing applications and back-end services. The three main high-level packages are `backend/core`, `sites`, and `ui-components`.

The sites package contains reference implementations for each of the two main user-facing applications in the system:

---

- `sites/public` is the applicant-facing site available to the general public. It provides the ability to browse available listings and to apply for listings either using the Common Application (which we built and maintain) or an external link to an online or paper PDF application.
- Visit [sites/public/README](https://github.com/bloom-housing/bloom/blob/dev/sites/public/README.md) for more details.

- `sites/partners` is the site designed for housing developers, property managers, and city/county (jurisdiction) employees. At the moment it offers the ability to view, edit, and export applications for listings and other administrative tasks. In the near future it will offer the ability to create, edit, and publish listings (which at the moment is done internally by our team). A login is required to use the Partners Portal.
- Visit [sites/partners/README](https://github.com/bloom-housing/bloom/blob/dev/sites/partners/README.md) for more details.

Currently across our jurisdictions, our backend and partners portal implementations are shared, and the public site diverges slightly to accomodate jurisdictional customizations. The [housingbayarea Bloom fork](https://github.com/housingbayarea/bloom) is an example with customized public sites. In this fork of Bloom, our jurisdictions are each a separate branch.

---

- `backend/core` is the container for the key backend services (e.g. listings, applications, users). Information is stored in a Postgres database and served over HTTPS to the front-end (either at build time for things that can be server-rendered, or at run time). Most services are part of a NestJS application which allows for consolidated operation in one runtime environment. Services expose a REST API, and aren't expected to have any UI other than for debugging. You can read more about our backend in the README in that package.
- Visit [backend/core/README](https://github.com/bloom-housing/bloom/blob/dev/backend/core/README.md) for more details.

---

- `ui-components` contains React components that are either shared between our applications or pulled out to be more customizable for our consumers. We use [Storybook](https://storybook.js.org/), an environment for easily browing the UI components independent of their implementation. Contributions to component stories are encouraged.
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

### Running a local test server

```
yarn dev:all
```

This runs 3 processes for both apps and the backend services on 3 different ports:

- 3000 for the public app
- 3001 for the partners app
- 3100 for backend/core

### Versioning

We are using [lerna](https://lerna.js.org/) as a package versioning tool. It helps with keeping multiple package versions in sync for the entire monorepo. In conjunction with Lerna we are also using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), a specification for commit messages that helps tools like Lerna understand what level of change the commit is so that you can automate things like versioning, releases, and changelogs. On commit, three steps run: (1) linting, (2) a conventional commit CLI, and (3) a verification of the conventional commit standard. If you have trouble with the CLI you may need to install the tool globally with `npm install -g commitizen`.

## Releasing

PRs are opened to our dev branch. Netlify deploy previews are generated and automatically posted to all PRs. We have an application in Netlify for our dev environment that is published on every push to dev.

Approximately weekly or as our roadmap requires us to, we will merge dev to master and then update our jurisdictional branches to get our changeset on a staging environment. Once that has been QA-ed we will publish to our production environment.

`ui-components` is currently released on an ad-hoc basis, but we will soon be implementing a more frequent automatic release.

## Contributing

Contributions to the core Bloom applications and services are welcomed. To help us meet the project's goals around quality and maintainability, we ask that all contributors read, understand, and agree to these guidelines.

### Issue tracking

Our development tasks are managed through GitHub issues and any development (in the vast majority of cases) should be tied to an issue. Even if you don't plan on implementing an issue yourself, please feel free to submit them if you run into issues. Before creating an issue, check first to see if one already exists. When creating an issue, give it a descriptive title and include screenshots if relevant. Please don't start work on an issue without checking in with the Bloom team first as it may already be in development! If you have questions, feel free to tag us on issues (@seanmalbert, @emilyjablonski) and note that we are also using GitHub discussions.

### Pull Requests

Pull requests are opened to the dev branch, not to master. When opening a pull request please fill out the entire pull request template which includes tagging the issue your PR is related to, a description of your PR, indicating the type of change, including details for the reviewer about how to test your PR, and a testing checklist. Additionally, officially link the issue in GitHub's right-hand panel.

Every PR needs to manually update our changelog. Find the relevant section (General, Frontend, Backend, UI Components) and subsection (Added, Changed, Fixed) and add a short description of your change followed by a link to the PR and your name (- Description Here ([#1234](https://github.com/bloom-housing/bloom/pull/1234)) (Your Name)). If it is a breaking change, please include **Breaking Change** and some notes below it about how to migrate.

When your PR is ready for review, add the `ready for review` label to help surface it to our internal team. If there are specific team members working frequently on pieces you're changing, assign them as reviewers. If you put up a PR that is not yet ready, add the `wip` label.

Once the PR has been approved, you either squash and merge if your changes are in one package, or rebase and merge if your changes are across packages to allow the versions based off of your commit messages to propagate appropriately.

As a review on a PR, try not to leave only comments. If the PR requires further discussion or changes, mark it with Requested Changes. If a PR looks good to you or even if there are smaller changes requested that won't require an additional review, please mark it with Approved and comment on the last few changes needed. This helps other reviewers better understand the state of PRs at the list view and prevents an additionl unnecessary review cycle.
