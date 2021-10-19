# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-pre-tailwind.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.0...@bloom-housing/public@2.0.0-pre-tailwind.1) (2021-10-19)


### Bug Fixes

* Remove shared-helpers dependency from ui-components ([#2032](https://github.com/bloom-housing/bloom/issues/2032)) ([dba201f](https://github.com/bloom-housing/bloom/commit/dba201fa62523c59fc160addab793a7eac20609f))





# 2.0.0-pre-tailwind.0 (2021-10-19)

### Bug Fixes

- **backend:** change tokenMissing to account already confirmed error … ([#1971](https://github.com/bloom-housing/bloom/issues/1971)) ([bc6ec92](https://github.com/bloom-housing/bloom/commit/bc6ec9243fb5be62ca8e240d96b828d418a9ee5b))
- **backend:** unitCreate and UnitUpdateDto now require only IdDto for… ([#1956](https://github.com/bloom-housing/bloom/issues/1956)) ([43dcfbe](https://github.com/bloom-housing/bloom/commit/43dcfbe7493bdd654d7b898ed9650804a016065c)), closes [#1897](https://github.com/bloom-housing/bloom/issues/1897)
- netlify doesn't like specifying the start command in toml ([2691011](https://github.com/bloom-housing/bloom/commit/2691011cbd2512acce7bac0657119e5a41d399f0))
- new icons for notifications ([8da124a](https://github.com/bloom-housing/bloom/commit/8da124a1f8bf795badb6d5149081f694bec416be))
- Reponsive TW grid classes, nested overlays ([#1881](https://github.com/bloom-housing/bloom/issues/1881)) ([620ed1f](https://github.com/bloom-housing/bloom/commit/620ed1fbbf0466336a53ea233cdb0c3984eeda15))
- show LM preview without building address ([#1960](https://github.com/bloom-housing/bloom/issues/1960)) ([2de0172](https://github.com/bloom-housing/bloom/commit/2de0172cec6f7df43259823f2b62bb165ec331fc))
- translation typo in alternate contact page ([#1914](https://github.com/bloom-housing/bloom/issues/1914)) ([9792048](https://github.com/bloom-housing/bloom/commit/9792048dbf6469d641b938b712e9774853ca18f4))
- updates from alameda ([#1958](https://github.com/bloom-housing/bloom/issues/1958)) ([37cea05](https://github.com/bloom-housing/bloom/commit/37cea05c2b61ce23ceda926da9a0751558252910))

### chore

- Add new `shared-helpers` package ([#1911](https://github.com/bloom-housing/bloom/issues/1911)) ([6e5d91b](https://github.com/bloom-housing/bloom/commit/6e5d91be5ccafd3d4b5bc1a578f2246a5e7f905b))

### Features

- listings management draft and publish validation backend & frontend ([#1850](https://github.com/bloom-housing/bloom/issues/1850)) ([ef67997](https://github.com/bloom-housing/bloom/commit/ef67997a056c6f1f758d2fa67bf877d4a3d897ab))
- new subheader prop and custom class names on ListingCard ([e2ddbc7](https://github.com/bloom-housing/bloom/commit/e2ddbc776a0a9740f50a3bbfd7442f06597206dc))
- responsive table refactor ([#1937](https://github.com/bloom-housing/bloom/issues/1937)) ([4c8b322](https://github.com/bloom-housing/bloom/commit/4c8b3221c68a7ed726c76bbf89781cff8c7b1626))
- Support PDF uploads or webpage links for building selection criteria ([#1893](https://github.com/bloom-housing/bloom/issues/1893)) ([8514b43](https://github.com/bloom-housing/bloom/commit/8514b43ba337d33cb877ff468bf780ff47fdc772))

### Performance Improvements

- separates css imports and disables local purge ([#1883](https://github.com/bloom-housing/bloom/issues/1883)) ([668968e](https://github.com/bloom-housing/bloom/commit/668968e45072e9a5121af3cf32d0d8307c671907)), closes [#1882](https://github.com/bloom-housing/bloom/issues/1882)

### BREAKING CHANGES

- **backend:** POST/PUT /listings interface change

- fix: updates ui component version

- Fix code style issues with Prettier

- fix(backend-swagger): manually add totalFlagged until fixed

Co-authored-by: Sean Albert <smabert@gmail.com>
Co-authored-by: Lint Action <lint-action@samuelmeuli.com>

- moves form keys out of ui-components

- fix: demographics typing
- tableHeader prop moved into a new tableHeaderProps object that contains all the new
  header props

## 1.0.5 (2021-08-03)

## 1.0.3 (2021-06-15)

## 1.0.2 (2021-06-07)

### Bug Fixes

- coliseum preferences issues - allow optional description & generic decline ([#1267](https://github.com/bloom-housing/bloom/issues/1267)) ([9ab6cae](https://github.com/bloom-housing/bloom/commit/9ab6caefb9e4576804ae5223bc94726b0f895dc1))
- preference select text issues ([#1270](https://github.com/bloom-housing/bloom/issues/1270)) ([69f1ceb](https://github.com/bloom-housing/bloom/commit/69f1ceb1e60763df929ad74e1b65ad2f3364bdbf))

### Features

- new checkbox behavior ([#1272](https://github.com/bloom-housing/bloom/issues/1272)) ([baa0c24](https://github.com/bloom-housing/bloom/commit/baa0c24e645c5d441280e1eb7c92c77b0be5af29))

# 1.0.0 (2021-05-21)

### Bug Fixes

- birthdate localizing issues ([#1202](https://github.com/bloom-housing/bloom/issues/1202)) ([114e21b](https://github.com/bloom-housing/bloom/commit/114e21bd1440e18f2420b74d9327123203d4c048))
- bmr translation issue ([#1203](https://github.com/bloom-housing/bloom/issues/1203)) ([04007b8](https://github.com/bloom-housing/bloom/commit/04007b8d34510d330883f1ab50b5c9ca0a40534c))
- referral application section on mobile ([#1201](https://github.com/bloom-housing/bloom/issues/1201)) ([5a5b06b](https://github.com/bloom-housing/bloom/commit/5a5b06b9d0a1d746a4916c84e2d2e5adfe5538a8))
- storybook svgs don't appear ([#1230](https://github.com/bloom-housing/bloom/issues/1230)) ([1796f1d](https://github.com/bloom-housing/bloom/commit/1796f1daf805fe76560293e52151a1fce34d1122))

## 0.3.11 (2021-04-22)

## 0.3.10 (2021-03-04)

## 0.3.9 (2021-02-16)

## 0.3.8 (2021-02-08)

## 0.3.6 (2021-02-08)

## 0.3.5 (2021-01-21)

## [0.2.5](https://github.com/bloom-housing/bloom/compare/v0.2.3...v0.2.5) (2020-06-30)

**Note:** Version bump only for package @bloom-housing/public-reference

## [0.2.2](https://github.com/bloom-housing/bloom/compare/v0.2.1...v0.2.2) (2020-06-05)

**Note:** Version bump only for package @bloom-housing/public-reference

## [0.2.1](https://github.com/bloom-housing/bloom/compare/v0.2.0...v0.2.1) (2020-06-05)

**Note:** Version bump only for package @bloom-housing/public-reference

## [0.0.9](https://github.com/bloom-housing/bloom/compare/v0.0.2...v0.0.9) (2020-04-21)

### Reverts

- Revert "Getting layout component ready for Google Analytics" ([7ca55ec](https://github.com/bloom-housing/bloom/commit/7ca55ec94c1f377a8e40645f9cc61780b7c1cefa))
