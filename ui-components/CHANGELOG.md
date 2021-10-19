# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0-alpha.1 (2021-10-19)

### Bug Fixes

- a11y and alignment issues in the image card tint ([#1964](https://github.com/bloom-housing/bloom/issues/1964)) ([56addba](https://github.com/bloom-housing/bloom/commit/56addbafded648f9ec4d218ee5f3f6e11057e004))
- **backend:** change tokenMissing to account already confirmed error … ([#1971](https://github.com/bloom-housing/bloom/issues/1971)) ([bc6ec92](https://github.com/bloom-housing/bloom/commit/bc6ec9243fb5be62ca8e240d96b828d418a9ee5b))
- new icons for notifications ([8da124a](https://github.com/bloom-housing/bloom/commit/8da124a1f8bf795badb6d5149081f694bec416be))
- Reponsive TW grid classes, nested overlays ([#1881](https://github.com/bloom-housing/bloom/issues/1881)) ([620ed1f](https://github.com/bloom-housing/bloom/commit/620ed1fbbf0466336a53ea233cdb0c3984eeda15))
- style fixes on the StackedTable ([#2025](https://github.com/bloom-housing/bloom/issues/2025)) ([2c5cc71](https://github.com/bloom-housing/bloom/commit/2c5cc71523afdeaa3e4f948a7d3ec34a5ad95489))
- translation typo in alternate contact page ([#1914](https://github.com/bloom-housing/bloom/issues/1914)) ([9792048](https://github.com/bloom-housing/bloom/commit/9792048dbf6469d641b938b712e9774853ca18f4))
- visual QA on SiteHeader ([#2010](https://github.com/bloom-housing/bloom/issues/2010)) ([ce86277](https://github.com/bloom-housing/bloom/commit/ce86277d451d83630ba79e89dfb8ad9c4b69bdae))

### chore

- Add new `shared-helpers` package ([#1911](https://github.com/bloom-housing/bloom/issues/1911)) ([6e5d91b](https://github.com/bloom-housing/bloom/commit/6e5d91be5ccafd3d4b5bc1a578f2246a5e7f905b))

### Code Refactoring

- Update textarea character limits ([#1906](https://github.com/bloom-housing/bloom/issues/1906)) ([96d362f](https://github.com/bloom-housing/bloom/commit/96d362f0e8740d255f298ef7505f4933982e270d)), closes [#1890](https://github.com/bloom-housing/bloom/issues/1890)

### Features

- add screenreader messages to ProgresssNav ([#1922](https://github.com/bloom-housing/bloom/issues/1922)) ([569df79](https://github.com/bloom-housing/bloom/commit/569df790ce9bfb4f9bb290e4a1613e683371de79))
- listings management draft and publish validation backend & frontend ([#1850](https://github.com/bloom-housing/bloom/issues/1850)) ([ef67997](https://github.com/bloom-housing/bloom/commit/ef67997a056c6f1f758d2fa67bf877d4a3d897ab))
- new subheader prop and custom class names on ListingCard ([e2ddbc7](https://github.com/bloom-housing/bloom/commit/e2ddbc776a0a9740f50a3bbfd7442f06597206dc))
- required labels on listings management fields ([#1924](https://github.com/bloom-housing/bloom/issues/1924)) ([0a2e2da](https://github.com/bloom-housing/bloom/commit/0a2e2da473938c510afbb7cd1ddcd2287813a972))
- responsive table refactor ([#1937](https://github.com/bloom-housing/bloom/issues/1937)) ([4c8b322](https://github.com/bloom-housing/bloom/commit/4c8b3221c68a7ed726c76bbf89781cff8c7b1626))
- Show confirmation modal when publishing listings ([#1847](https://github.com/bloom-housing/bloom/issues/1847)) ([2de8062](https://github.com/bloom-housing/bloom/commit/2de80625ee9569f41f57debf04e2030829b6c969)), closes [#1772](https://github.com/bloom-housing/bloom/issues/1772) [#1772](https://github.com/bloom-housing/bloom/issues/1772)
- Support PDF uploads or webpage links for building selection criteria ([#1893](https://github.com/bloom-housing/bloom/issues/1893)) ([8514b43](https://github.com/bloom-housing/bloom/commit/8514b43ba337d33cb877ff468bf780ff47fdc772))

### Performance Improvements

- separates css imports and disables local purge ([#1883](https://github.com/bloom-housing/bloom/issues/1883)) ([668968e](https://github.com/bloom-housing/bloom/commit/668968e45072e9a5121af3cf32d0d8307c671907)), closes [#1882](https://github.com/bloom-housing/bloom/issues/1882)

### BREAKING CHANGES

- moves form keys out of ui-components

- fix: demographics typing
- Default limit is 1000 now
- tableHeader prop moved into a new tableHeaderProps object that contains all the new
  header props

## 1.0.5 (2021-08-03)

## 1.0.4-stage (2021-07-07)

### Reverts

- Revert "Merge latest master (#1370)" (#1394) ([169872b](https://github.com/bloom-housing/bloom/commit/169872b497edfbe57691adfe38ba6c5251573f26)), closes [#1370](https://github.com/bloom-housing/bloom/issues/1370) [#1394](https://github.com/bloom-housing/bloom/issues/1394) [#1370](https://github.com/bloom-housing/bloom/issues/1370)

## 1.0.4-pre-props (2021-06-21)

## 1.0.3 (2021-06-15)

### Bug Fixes

- unit tables multiple rows for same rent type, sorting issues ([#1306](https://github.com/bloom-housing/bloom/issues/1306)) ([9be5342](https://github.com/bloom-housing/bloom/commit/9be534253e93c7cd5b974dc7bc11028e17013c37))

### Features

- navbar custom widths and image only support ([#1346](https://github.com/bloom-housing/bloom/issues/1346)) ([00eaceb](https://github.com/bloom-housing/bloom/commit/00eacebd793d817b95808f5cc0f1da39994c6a9b))

## 1.0.2 (2021-06-07)

### Bug Fixes

- coliseum preferences issues - allow optional description & generic decline ([#1267](https://github.com/bloom-housing/bloom/issues/1267)) ([9ab6cae](https://github.com/bloom-housing/bloom/commit/9ab6caefb9e4576804ae5223bc94726b0f895dc1))

### Features

- new checkbox behavior ([#1272](https://github.com/bloom-housing/bloom/issues/1272)) ([baa0c24](https://github.com/bloom-housing/bloom/commit/baa0c24e645c5d441280e1eb7c92c77b0be5af29))
- optionally hide preferences from listing page ([#1280](https://github.com/bloom-housing/bloom/issues/1280)) ([c7128b5](https://github.com/bloom-housing/bloom/commit/c7128b5d70e9b3e5134f41b53bb25233766c03b6))

# 1.0.0 (2021-05-21)

### Bug Fixes

- bmr translation issue ([#1203](https://github.com/bloom-housing/bloom/issues/1203)) ([04007b8](https://github.com/bloom-housing/bloom/commit/04007b8d34510d330883f1ab50b5c9ca0a40534c))
- storybook svgs don't appear ([#1230](https://github.com/bloom-housing/bloom/issues/1230)) ([1796f1d](https://github.com/bloom-housing/bloom/commit/1796f1daf805fe76560293e52151a1fce34d1122))
- waitlist open showing for every listing ([#1221](https://github.com/bloom-housing/bloom/issues/1221)) ([25d4d7b](https://github.com/bloom-housing/bloom/commit/25d4d7b43ec0a4382845b3c594912db72c9f897a))

## 0.3.11 (2021-04-22)

## 0.3.10 (2021-03-04)

## 0.3.9 (2021-02-16)

## 0.3.8 (2021-02-08)

## 0.3.6 (2021-02-08)

## 0.3.5 (2021-01-21)

## [0.2.5](https://github.com/bloom-housing/bloom/compare/v0.2.3...v0.2.5) (2020-06-30)

**Note:** Version bump only for package @bloom-housing/ui-components

## [0.2.2](https://github.com/bloom-housing/bloom/compare/v0.2.1...v0.2.2) (2020-06-05)

**Note:** Version bump only for package @bloom-housing/ui-components

## [0.2.1](https://github.com/bloom-housing/bloom/compare/v0.2.0...v0.2.1) (2020-06-05)

**Note:** Version bump only for package @bloom-housing/ui-components

## [0.0.9](https://github.com/bloom-housing/bloom/compare/v0.0.2...v0.0.9) (2020-04-21)

**Note:** Version bump only for package @bloom-housing/ui-components
