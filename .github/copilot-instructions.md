# Copilot Cloud Agent Instructions for `bloom-housing/bloom`

## Repository at a glance
- Monorepo with four main areas:
  - `api` (NestJS + Prisma backend)
  - `sites/public` (Next.js public app)
  - `sites/partners` (Next.js partners app)
  - `shared-helpers` (shared TS/React helpers, types, views)
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
- For translations in fork-specific UI, use `tIfExists` patterns from `shared-helpers/src/utilities/translation.ts`.

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

5. **One API unit test still failed after CI-like env setup**  
   - Failure observed: `test/unit/services/geocoding.service.spec.ts` expected update-call count mismatch (`expected 3`, `received 4`).
   - Treat as potential pre-existing/flaky baseline when unrelated to your change; do not broaden scope unless your change touches geocoding logic.

## Practical cloud-agent strategy
- Read root and package README files first, then matching workflow YAML for exact CI behavior.
- Prefer targeted tests for touched files/packages; avoid full e2e/Cypress unless task requires it.
- If build/test failures look unrelated, capture logs clearly and proceed with scoped validation for changed code.
