# Copilot Cloud Agent Instructions for `bloom-housing/bloom`


## Application overview

Bloom is an affordable housing platform. There are two separate applications in this monorepo: a public-facing app for housing seekers, and a partners app for developers and property managers. The public app includes a listing search and application portal, while the partners app includes listing management, application review, and reporting tools. 

## Fork model

This repository is called "core". The model for Bloom is to have one generic core codebase that is forked by each housing jurisdiction. The applications are designed to be customizable through feature flags, translation keys, and CSS overrides, but otherwise the best practice is to have no customizations.

## Repository at a glance
- Monorepo with four main areas:
  - `api` (NestJS + Prisma backend)
  - `sites/public` (Next.js public app)
  - `sites/partners` (Next.js partners app)
  - `shared-helpers` (shared TS/React helpers, types, views, scripts)
- Root `package.json` is the main entrypoint for common commands.
- Node version in CI is **22**.

## First-time setup workflow
1. Start in repo root: `/home/runner/work/bloom/bloom`
2. Install dependencies:
   - Normal: `yarn install`
   - In restricted-network sandboxes: `SENTRYCLI_SKIP_DOWNLOAD=1 CYPRESS_INSTALL_BINARY=0 yarn install`
3. Copy env templates before app builds/runs:
   - `cp /home/runner/work/bloom/bloom/api/.env.template /home/runner/work/bloom/bloom/api/.env`
   - `cp /home/runner/work/bloom/bloom/sites/public/.env.template /home/runner/work/bloom/bloom/sites/public/.env`
   - `cp /home/runner/work/bloom/bloom/sites/partners/.env.template /home/runner/work/bloom/bloom/sites/partners/.env`
4. For API-focused work, ensure test env values are present (notably `TIME_ZONE=America/Los_Angeles` and `CLOUDINARY_CLOUD_NAME=exygy`; see `api/README.md`).

## Fast navigation and ownership hints
- Backend business logic: `api/src/services`
- Backend endpoints: `api/src/controllers`
- Backend unit tests: `api/test/unit`
- Public app pages/components/tests: `sites/public/src`, `sites/public/__tests__`
- Partners app pages/components/tests: `sites/partners/src`, `sites/partners/__tests__`
- Shared cross-app logic/components/types/tests: `shared-helpers/src`, `shared-helpers/__tests__`
- CI behavior and canonical command patterns: `.github/workflows/*.yml`

## Validation commands (prefer smallest relevant scope)
- Root lint (includes API lint):  
  `cd /home/runner/work/bloom/bloom && yarn lint`
- Public unit tests:  
  `cd /home/runner/work/bloom/bloom && yarn test:app:public:unit`
- Partners unit tests:  
  `cd /home/runner/work/bloom/bloom && yarn test:app:partners:unit`
- Shared helpers tests:  
  `cd /home/runner/work/bloom/bloom && yarn test:shared-helpers`
- API build/tests:
  - Build: `cd /home/runner/work/bloom/bloom/api && yarn build`
  - Unit tests: `cd /home/runner/work/bloom/bloom/api && yarn test`

When changing one area, run that area’s tests first, then run broader checks only as needed.

## Implementation conventions that help avoid regressions
- Follow existing file patterns in each package (NestJS patterns in `api`, Next.js patterns in `sites/*`).
- Keep changes focused; avoid broad refactors in this monorepo unless required.
- Reuse existing shared helpers/types instead of duplicating interfaces or utilities.

## Errors encountered in this cloud sandbox and workarounds
1. **`yarn install` failed downloading `@sentry/cli` binary**  
   - Error: `ENOTFOUND downloads.sentry-cdn.com`  
   - Workaround: `SENTRYCLI_SKIP_DOWNLOAD=1 yarn install`

2. **`yarn install` failed downloading Cypress binary**  
   - Error: `ENOTFOUND download.cypress.io`  
   - Workaround: `CYPRESS_INSTALL_BINARY=0 yarn install`

3. **`sites/public` build failed during prerender with missing env context**  
   - Observed failures included invalid/missing analytics env and prerender `TypeError` paths.  
   - Workaround: ensure `.env` is created from `sites/public/.env.template` before building; use template defaults for `GA_KEY`, `GTM_KEY`, and related keys.

4. **`api` unit tests had local failures when run with incomplete env**  
   - Missing/incorrect env can produce noisy service initialization errors and unstable expectations.
   - Workaround: run with CI-like env values from `.github/workflows/unit_tests_api.yml` and required README values (`TIME_ZONE`, `CLOUDINARY_CLOUD_NAME`).

## Practical cloud-agent strategy
- Read root and package README files first, then matching workflow YAML for exact CI behavior.
- Prefer targeted tests for touched files/packages; avoid full e2e/Cypress unless task requires it.
- If build/test failures look unrelated, capture logs clearly and proceed with scoped validation for changed code.

## Project guidelines
- Always use the conventional commit format for commit messages and PR titles.
- Use the prettier configuration in the repo root for consistent formatting.
- Unit tests are required for new features and bug fixes; aim for good coverage of new logic and edge cases, but avoid over-testing implementation details.
- Unit/Integration tests should be written with Jest and React Testing Library; avoid Cypress for new tests unless the happy path of new end-to-end behavior is being validated.
- Always follow good security practices, especially when handling user data or authentication flows. If you identify a potential security issue, report it immediately and follow responsible disclosure guidelines.
- Accessibility is a key focus.
- Follow existing patterns and prefer `ui-seeds` and CSS/SCSS variables over `ui-components` and Tailwind for consistent styling (though both component libraries are owned by the team, so bugs in either can be reported and fixed).
- Use scripts and utilities in `shared-helpers` when possible to avoid duplication and maintain consistency across the public and partners apps. If you find a gap in shared functionality, consider adding to `shared-helpers` rather than creating new utilities in each app.
- Translation keys used only in partners should be added to the partners translation file `sites/partners/page_content/locales/general.json`. Translation keys used only in partners that we anticipate will be overridden in a fork should be added to the partners translation overrides file `sites/partners/page_content/overrides/general.json`. 
- Translation keys used anywhere in public, even if also used in partners, should be added to the shared translation files, with the English file at `shared-helpers/src/locales/general.json`. All strings added to this file need translations in all non-English languages, which can be generated with `ts-node get-machine-translations.ts` from the `shared-helpers` directory given the environment variables are added.
- Use `tIfExists` only for translation keys that may not exist in all forks, as a method of adding custom content without having to use a feature flag. We should use generic content for these keys, added to the `sites/public/page_content/locale_overrides/general.json` file for the public site and `sites/partners/page_content/overrides/general.json` for the partners site, and then allow forks to override or remove those keys as needed.
- Make no references to real, specific jurisdictions or projects in the core codebase. If jurisdiction-specific content is needed, use generic language in translation keys in core so that they can be overridden or removed as needed by forks. If jurisdiction-specific logic is needed, use feature flags to gate that logic and add the feature flag to the partners app so that it can be enabled or disabled as needed by forks. We have generic jurisdictions that are placeholders for real jurisdictions, such as "Bloomington", that can be used in translation keys and content when jurisdiction-specific language is needed. If you find that you need to add new generic jurisdiction names, please use similarly generic language and avoid referencing real places.
