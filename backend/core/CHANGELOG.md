# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-pre-tailwind.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.0...@bloom-housing/backend-core@2.0.0-pre-tailwind.1) (2021-10-19)

**Note:** Version bump only for package @bloom-housing/backend-core

# 2.0.0-pre-tailwind.0 (2021-10-19)

### Bug Fixes

- **backend:** change tokenMissing to account already confirmed error … ([#1971](https://github.com/bloom-housing/bloom/issues/1971)) ([bc6ec92](https://github.com/bloom-housing/bloom/commit/bc6ec9243fb5be62ca8e240d96b828d418a9ee5b))
- **backend:** totalFlagged from AFS missing in swagger documentation ([#1997](https://github.com/bloom-housing/bloom/issues/1997)) ([0abf5dd](https://github.com/bloom-housing/bloom/commit/0abf5ddefe8d4f33a895fe3faf59d43316f56003))
- **backend:** unitCreate and UnitUpdateDto now require only IdDto for… ([#1956](https://github.com/bloom-housing/bloom/issues/1956)) ([43dcfbe](https://github.com/bloom-housing/bloom/commit/43dcfbe7493bdd654d7b898ed9650804a016065c)), closes [#1897](https://github.com/bloom-housing/bloom/issues/1897)
- fix dev seeds with new priority types ([#1920](https://github.com/bloom-housing/bloom/issues/1920)) ([b01bd7c](https://github.com/bloom-housing/bloom/commit/b01bd7ca2c1ba3ba7948ad8213a0939375003d90))
- fix: maps unit max occupancy to household size ([d1fefcf](https://github.com/bloom-housing/bloom/commit/d1fefcf2ea20cccf90375881c2a19d51bf986678))
- fixes reserved community type import ([e5b0e25](https://github.com/bloom-housing/bloom/commit/e5b0e25f556af6cdcdf05d79825736dddcd1e105))
- fixes unit types for max income ([87f018a](https://github.com/bloom-housing/bloom/commit/87f018a410657037a7c9a74a93ec6dbac6b42dec))
- fixes unit types for max income ([#2013](https://github.com/bloom-housing/bloom/issues/2013)) ([b8966a1](https://github.com/bloom-housing/bloom/commit/b8966a19ea79012456f7f28d01c34b32d6f207bb))
- multiple ami charts should show a max not a range ([#1925](https://github.com/bloom-housing/bloom/issues/1925)) ([142f436](https://github.com/bloom-housing/bloom/commit/142f43697bff23d2f59c7897d51ced83a2003308))
- plus one to maxHouseholdSize for bmr ([401c956](https://github.com/bloom-housing/bloom/commit/401c956b0e885d3485b427622b82b85fd9a5f8b1))
- removes 150 char limit on textarea fields ([6eb7036](https://github.com/bloom-housing/bloom/commit/6eb70364409c5910aa9b8277b37a8214c2a94358))
- removes nested validation from applicationAddress ([747fd83](https://github.com/bloom-housing/bloom/commit/747fd836a9b5b8333a6586727b00c5674ef87a86))
- update alameda's notification sign up URL ([#1874](https://github.com/bloom-housing/bloom/issues/1874)) ([3eb85fc](https://github.com/bloom-housing/bloom/commit/3eb85fccf7521e32f3d1f369e706cec0c078b536))

### Features

- **backend:** add jurisdiction relation to ami charts entity ([#1905](https://github.com/bloom-housing/bloom/issues/1905)) ([1f13985](https://github.com/bloom-housing/bloom/commit/1f13985142c7908b4c37eaf0fbbbad0ad660f014))
- **backend:** add jurisidction relation to ReservedCommunittType Entity ([#1889](https://github.com/bloom-housing/bloom/issues/1889)) ([9b0fe73](https://github.com/bloom-housing/bloom/commit/9b0fe73fe9ed1349584e119f235cb66f6e68785f))
- listings management draft and publish validation backend & frontend ([#1850](https://github.com/bloom-housing/bloom/issues/1850)) ([ef67997](https://github.com/bloom-housing/bloom/commit/ef67997a056c6f1f758d2fa67bf877d4a3d897ab))
- Support PDF uploads or webpage links for building selection criteria ([#1893](https://github.com/bloom-housing/bloom/issues/1893)) ([8514b43](https://github.com/bloom-housing/bloom/commit/8514b43ba337d33cb877ff468bf780ff47fdc772))

### Performance Improvements

- **applications and flagged sets:** adds indexes and updates listWit… ([#2003](https://github.com/bloom-housing/bloom/issues/2003)) ([f9efb15](https://github.com/bloom-housing/bloom/commit/f9efb15b930865b517249d5dc525c11d68dc251d))

### Reverts

- Revert "latest dev (#1999)" ([73a2789](https://github.com/bloom-housing/bloom/commit/73a2789d8f133f2d788e2399faa42b374d74ab15)), closes [#1999](https://github.com/bloom-housing/bloom/issues/1999)
- **backend:** revert some listing filters ([#1984](https://github.com/bloom-housing/bloom/issues/1984)) ([14847e1](https://github.com/bloom-housing/bloom/commit/14847e1a797930f3e30bd945a2617dec2e3d679f))

### BREAKING CHANGES

- **backend:** POST/PUT /listings interface change

- fix: updates ui component version

- Fix code style issues with Prettier

- fix(backend-swagger): manually add totalFlagged until fixed

Co-authored-by: Sean Albert <smabert@gmail.com>
Co-authored-by: Lint Action <lint-action@samuelmeuli.com>

## 1.0.5 (2021-08-03)

## 1.0.5-stage (2021-07-30)

## 1.0.3 (2021-06-15)

### Bug Fixes

- unit tables multiple rows for same rent type, sorting issues ([#1306](https://github.com/bloom-housing/bloom/issues/1306)) ([9be5342](https://github.com/bloom-housing/bloom/commit/9be534253e93c7cd5b974dc7bc11028e17013c37))

## 1.0.2 (2021-06-07)

### Bug Fixes

- coliseum preferences issues - allow optional description & generic decline ([#1267](https://github.com/bloom-housing/bloom/issues/1267)) ([9ab6cae](https://github.com/bloom-housing/bloom/commit/9ab6caefb9e4576804ae5223bc94726b0f895dc1))
- preference select text issues ([#1270](https://github.com/bloom-housing/bloom/issues/1270)) ([69f1ceb](https://github.com/bloom-housing/bloom/commit/69f1ceb1e60763df929ad74e1b65ad2f3364bdbf))

### Features

- new checkbox behavior ([#1272](https://github.com/bloom-housing/bloom/issues/1272)) ([baa0c24](https://github.com/bloom-housing/bloom/commit/baa0c24e645c5d441280e1eb7c92c77b0be5af29))
- optionally hide preferences from listing page ([#1280](https://github.com/bloom-housing/bloom/issues/1280)) ([c7128b5](https://github.com/bloom-housing/bloom/commit/c7128b5d70e9b3e5134f41b53bb25233766c03b6))

# 1.0.0 (2021-05-21)

### Bug Fixes

- bmr translation issue ([#1203](https://github.com/bloom-housing/bloom/issues/1203)) ([04007b8](https://github.com/bloom-housing/bloom/commit/04007b8d34510d330883f1ab50b5c9ca0a40534c))
- waitlist open showing for every listing ([#1221](https://github.com/bloom-housing/bloom/issues/1221)) ([25d4d7b](https://github.com/bloom-housing/bloom/commit/25d4d7b43ec0a4382845b3c594912db72c9f897a))

## 0.3.11 (2021-04-22)

## 0.3.10 (2021-03-04)

## 0.3.9 (2021-02-16)

## 0.3.8 (2021-02-08)

## 0.3.7 (2021-02-08)

## 0.3.6 (2021-02-08)

## 0.3.5 (2021-01-21)

## 0.3.4 (2020-12-10)

## 0.2.16 (2020-10-02)

## 0.2.15 (2020-10-02)

### Reverts

- Revert "Fix email uniqueness for User entity (#657)" (#661) ([612a884](https://github.com/bloom-housing/bloom/commit/612a884668c60c5c9740af9b09309cc3cea18e95)), closes [#657](https://github.com/bloom-housing/bloom/issues/657) [#661](https://github.com/bloom-housing/bloom/issues/661)

## 0.2.14 (2020-08-10)

## 0.2.13 (2020-07-31)

## 0.2.11 (2020-07-15)

## 0.2.8 (2020-07-01)

## 0.2.7 (2020-06-30)

## 0.2.6 (2020-06-30)

## 0.2.5 (2020-06-30)

## 0.2.3 (2020-06-19)

# 0.2.0 (2020-06-04)

## [0.2.5](https://github.com/bloom-housing/bloom/compare/v0.2.3...v0.2.5) (2020-06-30)

**Note:** Version bump only for package @bloom-housing/backend-core

## [0.0.9](https://github.com/bloom-housing/bloom/compare/v0.0.2...v0.0.9) (2020-04-21)

**Note:** Version bump only for package @bloom-housing/listings-service
