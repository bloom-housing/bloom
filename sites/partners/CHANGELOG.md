# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-pre-tailwind.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/partners@2.0.0-pre-tailwind.0...@bloom-housing/partners@2.0.0-pre-tailwind.1) (2021-10-19)


### Bug Fixes

* Modals no longer prevent scroll after being closed ([#1962](https://github.com/bloom-housing/bloom/issues/1962)) ([667d5d3](https://github.com/bloom-housing/bloom/commit/667d5d3234c9a463c947c99d8c47acb9ac963e95))
* Remove shared-helpers dependency from ui-components ([#2032](https://github.com/bloom-housing/bloom/issues/2032)) ([dba201f](https://github.com/bloom-housing/bloom/commit/dba201fa62523c59fc160addab793a7eac20609f))





# 2.0.0-pre-tailwind.0 (2021-10-19)

### Bug Fixes

- adds applicationDueDate and Time to removeEmptyFields keysToIgnore ([f024427](https://github.com/bloom-housing/bloom/commit/f024427d4cd2039429e0d9e5db67a50011b5356e))
- ami chart values were not appearing after save and new ([#1952](https://github.com/bloom-housing/bloom/issues/1952)) ([cb65340](https://github.com/bloom-housing/bloom/commit/cb653409c8d2c403e1fbfa6ea71415b98af21455))
- **backend:** unitCreate and UnitUpdateDto now require only IdDto for… ([#1956](https://github.com/bloom-housing/bloom/issues/1956)) ([43dcfbe](https://github.com/bloom-housing/bloom/commit/43dcfbe7493bdd654d7b898ed9650804a016065c)), closes [#1897](https://github.com/bloom-housing/bloom/issues/1897)
- can remove application pick up and drop off addresses ([#1954](https://github.com/bloom-housing/bloom/issues/1954)) ([68238ce](https://github.com/bloom-housing/bloom/commit/68238ce87968345d4a8b1a0308a1a70295174675))
- improved UX for the Building Selection Criteria drawer ([#1994](https://github.com/bloom-housing/bloom/issues/1994)) ([4bd8b09](https://github.com/bloom-housing/bloom/commit/4bd8b09456b54584c3731bcca64019dc231d0c55))
- removes 150 char limit on textarea fields ([6eb7036](https://github.com/bloom-housing/bloom/commit/6eb70364409c5910aa9b8277b37a8214c2a94358))
- removes duplicate unitStatusOptions from UnitForm ([d3e71c5](https://github.com/bloom-housing/bloom/commit/d3e71c5dcc40b154f211b16ad3a1d1abac05ebae))
- Reponsive TW grid classes, nested overlays ([#1881](https://github.com/bloom-housing/bloom/issues/1881)) ([620ed1f](https://github.com/bloom-housing/bloom/commit/620ed1fbbf0466336a53ea233cdb0c3984eeda15))
- typo in the paper applications table ([#1965](https://github.com/bloom-housing/bloom/issues/1965)) ([a342772](https://github.com/bloom-housing/bloom/commit/a3427723cbaeb3282abbaa78ae61a69262b5d71c))
- visual QA on SiteHeader ([#2010](https://github.com/bloom-housing/bloom/issues/2010)) ([ce86277](https://github.com/bloom-housing/bloom/commit/ce86277d451d83630ba79e89dfb8ad9c4b69bdae))

### chore

- Add new `shared-helpers` package ([#1911](https://github.com/bloom-housing/bloom/issues/1911)) ([6e5d91b](https://github.com/bloom-housing/bloom/commit/6e5d91be5ccafd3d4b5bc1a578f2246a5e7f905b))

### Code Refactoring

- Update textarea character limits ([#1906](https://github.com/bloom-housing/bloom/issues/1906)) ([96d362f](https://github.com/bloom-housing/bloom/commit/96d362f0e8740d255f298ef7505f4933982e270d)), closes [#1890](https://github.com/bloom-housing/bloom/issues/1890)

### Features

- listings management draft and publish validation backend & frontend ([#1850](https://github.com/bloom-housing/bloom/issues/1850)) ([ef67997](https://github.com/bloom-housing/bloom/commit/ef67997a056c6f1f758d2fa67bf877d4a3d897ab))
- required labels on listings management fields ([#1924](https://github.com/bloom-housing/bloom/issues/1924)) ([0a2e2da](https://github.com/bloom-housing/bloom/commit/0a2e2da473938c510afbb7cd1ddcd2287813a972))
- Show confirmation modal when publishing listings ([#1847](https://github.com/bloom-housing/bloom/issues/1847)) ([2de8062](https://github.com/bloom-housing/bloom/commit/2de80625ee9569f41f57debf04e2030829b6c969)), closes [#1772](https://github.com/bloom-housing/bloom/issues/1772) [#1772](https://github.com/bloom-housing/bloom/issues/1772)
- Support PDF uploads or webpage links for building selection criteria ([#1893](https://github.com/bloom-housing/bloom/issues/1893)) ([8514b43](https://github.com/bloom-housing/bloom/commit/8514b43ba337d33cb877ff468bf780ff47fdc772))

### Performance Improvements

- separates css imports and disables local purge ([#1883](https://github.com/bloom-housing/bloom/issues/1883)) ([668968e](https://github.com/bloom-housing/bloom/commit/668968e45072e9a5121af3cf32d0d8307c671907)), closes [#1882](https://github.com/bloom-housing/bloom/issues/1882)

### Reverts

- Revert "latest dev (#1999)" ([73a2789](https://github.com/bloom-housing/bloom/commit/73a2789d8f133f2d788e2399faa42b374d74ab15)), closes [#1999](https://github.com/bloom-housing/bloom/issues/1999)

### BREAKING CHANGES

- **backend:** POST/PUT /listings interface change

- fix: updates ui component version

- Fix code style issues with Prettier

- fix(backend-swagger): manually add totalFlagged until fixed

Co-authored-by: Sean Albert <smabert@gmail.com>
Co-authored-by: Lint Action <lint-action@samuelmeuli.com>

- moves form keys out of ui-components

- fix: demographics typing
- Default limit is 1000 now

# 2.0.0-pre-tailwind (2021-09-16)

## 1.0.5 (2021-08-03)

## 1.0.3 (2021-06-15)

## 1.0.2 (2021-06-07)

### Features

- new checkbox behavior ([#1272](https://github.com/bloom-housing/bloom/issues/1272)) ([baa0c24](https://github.com/bloom-housing/bloom/commit/baa0c24e645c5d441280e1eb7c92c77b0be5af29))

# 1.0.0 (2021-05-21)

### Bug Fixes

- storybook svgs don't appear ([#1230](https://github.com/bloom-housing/bloom/issues/1230)) ([1796f1d](https://github.com/bloom-housing/bloom/commit/1796f1daf805fe76560293e52151a1fce34d1122))

## 0.3.11 (2021-04-22)

## 0.3.10 (2021-03-04)

## 0.3.9 (2021-02-16)

## 0.3.8 (2021-02-08)

## 0.3.6 (2021-02-08)

## 0.3.5 (2021-01-21)
