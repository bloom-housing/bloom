# Copilot Cloud Agent Instructions for `bloom-housing/bloom`

## Application overview

Bloom is an affordable housing platform. There are two separate applications in this monorepo: a public-facing app for housing seekers, and a partners app for developers and property managers. The public app includes a listing search and application portal; the partners app includes listing management, application review, and reporting tools.

## Repository layout

Monorepo with four main areas:

- `api` — NestJS + Prisma backend
- `sites/public` — Next.js public app
- `sites/partners` — Next.js partners app
- `shared-helpers` — shared TS/React helpers, types, views, scripts

Fast navigation:

- Backend business logic: `api/src/services`
- Backend endpoints: `api/src/controllers`
- Backend unit tests: `api/test/unit`
- Public app pages/components/tests: `sites/public/src`, `sites/public/__tests__`
- Partners app pages/components/tests: `sites/partners/src`, `sites/partners/__tests__`
- Shared cross-app logic/components/types/tests: `shared-helpers/src`, `shared-helpers/__tests__`
- CI behavior and canonical command patterns: `.github/workflows/*.yml`

Root `package.json` is the main entrypoint for common commands. Node version in CI is **22**.

## Setup
1. Start in repo root: `/home/runner/work/bloom/bloom`
2. Install dependencies: `yarn install`
   - In restricted-network sandboxes: `SENTRYCLI_SKIP_DOWNLOAD=1 CYPRESS_INSTALL_BINARY=0 yarn install`
3. Copy env templates before building/running:
   - `cp api/.env.template api/.env`
   - `cp sites/public/.env.template sites/public/.env`
   - `cp sites/partners/.env.template sites/partners/.env`
4. For API-focused work, ensure test env values are present (notably `TIME_ZONE=America/Los_Angeles` and `CLOUDINARY_CLOUD_NAME=exygy`; see [api/README.md](../api/README.md)).

## Common commands

- Dev (all): `yarn dev:all` (backend + both frontends)
- Dev (frontend only): `yarn dev:frontend`
- Dev (backend only): `yarn dev:backend`
- Dev (public + backend): `yarn dev:public`
- Dev (partners + backend): `yarn dev:partners`
- Lint (root, includes API): `yarn lint`
- Public unit tests: `yarn test:app:public:unit`
- Partners unit tests: `yarn test:app:partners:unit`
- Shared helpers tests: `yarn test:shared-helpers`
- API build: `cd api && yarn build`
- API unit tests: `cd api && yarn test`
- API e2e tests: `yarn test:backend:new:e2e`

Prefer the smallest relevant scope: when changing one area, run that area's tests first, then broaden only as needed.

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

## Conventions

### Fork model

This repository is called "core". Bloom's model is one generic core codebase forked by each housing jurisdiction. Applications are customized through feature flags, translation keys, and CSS overrides — otherwise the practice is **no jurisdiction-specific customizations or references** in core.

- Make no references to real, specific jurisdictions or projects. Use generic placeholder jurisdictions (e.g. "Bloomington") when jurisdiction-specific language is needed in examples/content. If a new generic jurisdiction name is needed, keep it similarly generic — never a real place.
- Jurisdiction-specific *logic* must be gated behind a feature flag (displayed in the partners app so forks can toggle it). See [docs/feature-flags.md](../docs/feature-flags.md).
- Jurisdiction-specific *content* should use overridable translation keys, not hardcoded strings.

### General

- Follow existing file patterns in each package (NestJS patterns in `api`, Next.js patterns in `sites/*`).
- Keep changes focused; avoid broad refactors in this monorepo unless required.
- Reuse existing shared helpers/types instead of duplicating interfaces or utilities. If there's a gap in shared functionality, prefer adding to `shared-helpers` over duplicating logic per app.
- Prefer `ui-seeds` and CSS/SCSS variables over `ui-components` and Tailwind for consistent styling. Both component libraries are owned by the team, so bugs in either can be reported and fixed.
- Run `yarn lint` before finishing any change — ESLint enforces Prettier formatting, and the warning budget is tight (root allows only 40 warnings, `api` only 2), so most new lint or formatting issues will fail rather than pass as warnings. Run `yarn prettier` to auto-fix formatting first if `yarn lint` reports style issues.
- Prefer small, independently reviewable and testable changes over broad multi-concern PRs, even when a ticket could technically be completed in one larger pass.
- Always use conventional commit format for commit messages and PR titles.
- PRs should link to an issue if one exists; otherwise the description should clearly summarize the change and its motivation. Follow the structure in [docs/pull_request_template.md](../docs/pull_request_template.md).
- `CHANGELOG.md` is archived and no longer maintained — don't update it as part of a change.

## Testing

- Unit tests are required for new features and bug fixes. Aim for good coverage of new logic and edge cases, but avoid over-testing implementation details.
- Write unit/integration tests with Jest and React Testing Library. Avoid Cypress for new tests unless validating the happy path of new end-to-end behavior.

## Translations

- Translation keys used only in partners: `sites/partners/page_content/locales/general.json`.
- Translation keys used only in partners but anticipated to be overridden in a fork: `sites/partners/page_content/overrides/general.json`.
- Translation keys used anywhere in public (even if also used in partners): shared file at `shared-helpers/src/locales/general.json`. Every string added here needs translations in all non-English languages — generate with `ts-node get-machine-translations.ts` from `shared-helpers` (requires env vars).
- Use `tIfExists` only for translation keys that may not exist in all forks, as a lightweight alternative to a feature flag for optional custom content. Add generic content for these keys to `sites/public/page_content/locale_overrides/general.json` (public) or `sites/partners/page_content/overrides/general.json` (partners), so forks can override or remove them while keeping main translation files identical.
- Migration-only translation keys can survive seed merges in forked repos and cause email content mismatches — be careful with `upsertTranslation`-style changes that touch both migrations and seeds.

## Feature flags

- Source of truth: [api/src/enums/feature-flags/feature-flags-enum.ts](../api/src/enums/feature-flags/feature-flags-enum.ts), shared across API and both frontends.
- Flags are boolean-only and not auto-added to the database — add to `featureFlagMap` and call the `featureFlags/addAllNew` API endpoint.
- Manage jurisdiction assignment via the hidden `/admin` page on the partners site (super admin only).
- Full docs: [docs/feature-flags.md](../docs/feature-flags.md). The flag table in that file is generated from `featureFlagMap` by `api/scripts/generate-markdown.ts` — after adding or changing a flag, regenerate it with `cd api && npx ts-node scripts/generate-markdown.ts` (also runs as part of `yarn generate:client`).

## Accessibility

WCAG 2.2 AA is a hard requirement. See [instructions/a11y.instructions.md](instructions/a11y.instructions.md) for anti-patterns, severity levels, and framework-specific fixes. If you spot an accessibility issue, report it and consider fixing it in a way that improves the experience broadly, not just for the one case at hand.

## Security

Follow good security practices, especially around user data and authentication flows. Report any potential security issue immediately and follow responsible disclosure rather than silently patching around it.

## Frontend / UI guidance

- Prefer smaller, incremental changes over large speculative UI implementations.
- Before building a new UI pattern, check `ui-seeds` and existing components in `sites/public/src` or `sites/partners/src` for something similar to extend rather than inventing a new pattern from scratch.