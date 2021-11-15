# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.1-alpha.18](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.17...@bloom-housing/public@3.0.1-alpha.18) (2021-11-15)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.17](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.16...@bloom-housing/public@3.0.1-alpha.17) (2021-11-15)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.16](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.15...@bloom-housing/public@3.0.1-alpha.16) (2021-11-15)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.15](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.14...@bloom-housing/public@3.0.1-alpha.15) (2021-11-15)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.14](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.13...@bloom-housing/public@3.0.1-alpha.14) (2021-11-12)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.13](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.12...@bloom-housing/public@3.0.1-alpha.13) (2021-11-12)


### Features

* refactor and add public site application flow cypress tests ([#2118](https://github.com/bloom-housing/bloom/issues/2118)) ([9ec0e8d](https://github.com/bloom-housing/bloom/commit/9ec0e8d05f9570773110754e7fdaf49254d1eab8))





## [3.0.1-alpha.12](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.11...@bloom-housing/public@3.0.1-alpha.12) (2021-11-12)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.11](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.10...@bloom-housing/public@3.0.1-alpha.11) (2021-11-11)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.10](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.9...@bloom-housing/public@3.0.1-alpha.10) (2021-11-10)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.8...@bloom-housing/public@3.0.1-alpha.9) (2021-11-09)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.7...@bloom-housing/public@3.0.1-alpha.8) (2021-11-09)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.6...@bloom-housing/public@3.0.1-alpha.7) (2021-11-09)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.5...@bloom-housing/public@3.0.1-alpha.6) (2021-11-09)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.4...@bloom-housing/public@3.0.1-alpha.5) (2021-11-09)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.3...@bloom-housing/public@3.0.1-alpha.4) (2021-11-09)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.2...@bloom-housing/public@3.0.1-alpha.3) (2021-11-08)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.1...@bloom-housing/public@3.0.1-alpha.2) (2021-11-08)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.1-alpha.0...@bloom-housing/public@3.0.1-alpha.1) (2021-11-08)

**Note:** Version bump only for package @bloom-housing/public





## [3.0.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@3.0.0...@bloom-housing/public@3.0.1-alpha.0) (2021-11-05)


* 1837/preferences cleanup 3 (#2144) ([3ce6d5e](https://github.com/bloom-housing/bloom/commit/3ce6d5eb5aac49431ec5bf4912dbfcbe9077d84e)), closes [#2144](https://github.com/bloom-housing/bloom/issues/2144)


### BREAKING CHANGES

* Preferences are now M-N relation with a listing and have an intermediate table with ordinal number

* refactor(backend): preferences deduplication

So far each listing referenced it's own unique Preferences. This change introduces Many to Many
relationship between Preference and Listing entity and forces sharing Preferences between listings.

* feat(backend): extend preferences migration with moving existing relations to a new intermediate tab

* feat(backend): add Preference - Jurisdiction ManyToMany relation

* feat: adapt frontend to backend changes

* fix(backend): typeORM preferences select statement

* fix(backend): connect preferences with jurisdictions in seeds, fix pref filter validator

* fix(backend): fix missing import in preferences-filter-params.ts

* refactor: rebase issue

* feat: uptake jurisdictional preferences

* fix: fixup tests

* fix: application preferences ignore page, always separate

* Remove page from src/migration/1633359409242-add-listing-preferences-intermediate-relation.ts

* fix: preference fetching and ordering/pages

* Fix code style issues with Prettier

* fix(backend): query User__leasingAgentInListings__jurisdiction_User__leasingAgentIn specified more

* fix: perferences cypress tests

Co-authored-by: Michal Plebanski <michalp@airnauts.com>
Co-authored-by: Emily Jablonski <emily.jablonski@exygy.com>
Co-authored-by: Lint Action <lint-action@samuelmeuli.com>





# [3.0.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/public@2.0.1-alpha.9...@bloom-housing/public@3.0.0) (2021-11-05)

**Note:** Version bump only for package @bloom-housing/public





## [2.0.1-alpha.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.1-alpha.8...@bloom-housing/public@2.0.1-alpha.9) (2021-11-05)

**Note:** Version bump only for package @bloom-housing/public





## [2.0.1-alpha.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.1-alpha.7...@bloom-housing/public@2.0.1-alpha.8) (2021-11-04)


### Reverts

* Revert "refactor: listing preferences and adds jurisdictional filtering" ([41f72c0](https://github.com/bloom-housing/bloom/commit/41f72c0db49cf94d7930f5cfc88f6ee9d6040986))





## [2.0.1-alpha.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.1-alpha.6...@bloom-housing/public@2.0.1-alpha.7) (2021-11-04)

**Note:** Version bump only for package @bloom-housing/public





## [2.0.1-alpha.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.1-alpha.5...@bloom-housing/public@2.0.1-alpha.6) (2021-11-04)


### Features

* Updates application confirmation numbers ([#2072](https://github.com/bloom-housing/bloom/issues/2072)) ([75cd67b](https://github.com/bloom-housing/bloom/commit/75cd67bcb62280936bdeeaee8c9b7b2583a1339d))





## [2.0.1-alpha.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.1-alpha.4...@bloom-housing/public@2.0.1-alpha.5) (2021-11-03)

**Note:** Version bump only for package @bloom-housing/public





## [2.0.1-alpha.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.1-alpha.3...@bloom-housing/public@2.0.1-alpha.4) (2021-11-03)

**Note:** Version bump only for package @bloom-housing/public





## [2.0.1-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.1-alpha.2...@bloom-housing/public@2.0.1-alpha.3) (2021-11-03)


### Bug Fixes

* SiteHeader visual issues with long menu bars ([#2068](https://github.com/bloom-housing/bloom/issues/2068)) ([fd6686e](https://github.com/bloom-housing/bloom/commit/fd6686e206b4e53ae8b6ab757ad0506eaead0d01))





## [2.0.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.1-alpha.1...@bloom-housing/public@2.0.1-alpha.2) (2021-11-02)


### Bug Fixes

* household member cypress test ([#2113](https://github.com/bloom-housing/bloom/issues/2113)) ([a6cd580](https://github.com/bloom-housing/bloom/commit/a6cd580f042fb8ff3c1cf03bec7198debdf22029))





## [2.0.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.1-alpha.0...@bloom-housing/public@2.0.1-alpha.1) (2021-11-02)


### Features

* two new common app questions - Household Changes and Household Student ([#2070](https://github.com/bloom-housing/bloom/issues/2070)) ([42a752e](https://github.com/bloom-housing/bloom/commit/42a752ec073c0f5b65374c7a68da1e34b0b1c949))





## [2.0.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0...@bloom-housing/public@2.0.1-alpha.0) (2021-11-02)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.26...@bloom-housing/public@2.0.0) (2021-11-02)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.26](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.25...@bloom-housing/public@2.0.0-pre-tailwind.26) (2021-11-02)


### Code Refactoring

* listing preferences and adds jurisdictional filtering ([9f661b4](https://github.com/bloom-housing/bloom/commit/9f661b43921ec939bd1bf5709c934ad6f56dd859))


### BREAKING CHANGES

* updates preference relationship with listings





# [2.0.0-pre-tailwind.25](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.24...@bloom-housing/public@2.0.0-pre-tailwind.25) (2021-11-01)


### Bug Fixes

* reverts preferences to re-add as breaking/major bump ([508078e](https://github.com/bloom-housing/bloom/commit/508078e16649e4d5f669273c50ef62407aab995f))
* reverts preferences to re-add as breaking/major bump ([4f7d893](https://github.com/bloom-housing/bloom/commit/4f7d89327361b3b28b368c23cfd24e6e8123a0a8))





# [2.0.0-pre-tailwind.24](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.23...@bloom-housing/public@2.0.0-pre-tailwind.24) (2021-10-30)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.23](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.22...@bloom-housing/public@2.0.0-pre-tailwind.23) (2021-10-30)


* Preferences cleanup (#1947) ([7329a58](https://github.com/bloom-housing/bloom/commit/7329a58cc9242faf647459e46de1e3cff3fe9c9d)), closes [#1947](https://github.com/bloom-housing/bloom/issues/1947)


### BREAKING CHANGES

* Preferences are now M-N relation with a listing and have an intermediate table with ordinal number

* refactor(backend): preferences deduplication

So far each listing referenced it's own unique Preferences. This change introduces Many to Many
relationship between Preference and Listing entity and forces sharing Preferences between listings.

* feat(backend): extend preferences migration with moving existing relations to a new intermediate tab

* feat(backend): add Preference - Jurisdiction ManyToMany relation

* feat: adapt frontend to backend changes

* fix(backend): typeORM preferences select statement

* fix(backend): connect preferences with jurisdictions in seeds, fix pref filter validator

* fix(backend): fix missing import in preferences-filter-params.ts

* refactor: rebase issue

* feat: uptake jurisdictional preferences

* fix: fixup tests

* fix: application preferences ignore page, always separate

* Remove page from src/migration/1633359409242-add-listing-preferences-intermediate-relation.ts

* fix: preference fetching and ordering/pages

* Fix code style issues with Prettier

* fix(backend): query User__leasingAgentInListings__jurisdiction_User__leasingAgentIn specified more

* fix: perferences cypress tests

Co-authored-by: Emily Jablonski <emily.jablonski@exygy.com>
Co-authored-by: Sean Albert <smabert@gmail.com>
Co-authored-by: Lint Action <lint-action@samuelmeuli.com>





# [2.0.0-pre-tailwind.22](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.21...@bloom-housing/public@2.0.0-pre-tailwind.22) (2021-10-29)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.21](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.20...@bloom-housing/public@2.0.0-pre-tailwind.21) (2021-10-29)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.20](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.19...@bloom-housing/public@2.0.0-pre-tailwind.20) (2021-10-29)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.19](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.18...@bloom-housing/public@2.0.0-pre-tailwind.19) (2021-10-29)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.18](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.17...@bloom-housing/public@2.0.0-pre-tailwind.18) (2021-10-29)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.17](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.16...@bloom-housing/public@2.0.0-pre-tailwind.17) (2021-10-29)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.16](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.15...@bloom-housing/public@2.0.0-pre-tailwind.16) (2021-10-28)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.15](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.14...@bloom-housing/public@2.0.0-pre-tailwind.15) (2021-10-28)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.14](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.13...@bloom-housing/public@2.0.0-pre-tailwind.14) (2021-10-27)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.13](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.12...@bloom-housing/public@2.0.0-pre-tailwind.13) (2021-10-26)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.12](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.11...@bloom-housing/public@2.0.0-pre-tailwind.12) (2021-10-25)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.11](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.10...@bloom-housing/public@2.0.0-pre-tailwind.11) (2021-10-25)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.10](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.9...@bloom-housing/public@2.0.0-pre-tailwind.10) (2021-10-22)


### Bug Fixes

* alternate contact email now validated ([#2035](https://github.com/bloom-housing/bloom/issues/2035)) ([b411695](https://github.com/bloom-housing/bloom/commit/b411695350f8f8de39c6994f2fac2fcb4678f678))





# [2.0.0-pre-tailwind.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.8...@bloom-housing/public@2.0.0-pre-tailwind.9) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.7...@bloom-housing/public@2.0.0-pre-tailwind.8) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.6...@bloom-housing/public@2.0.0-pre-tailwind.7) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.5...@bloom-housing/public@2.0.0-pre-tailwind.6) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.4...@bloom-housing/public@2.0.0-pre-tailwind.5) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.3...@bloom-housing/public@2.0.0-pre-tailwind.4) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.2...@bloom-housing/public@2.0.0-pre-tailwind.3) (2021-10-21)

**Note:** Version bump only for package @bloom-housing/public





# [2.0.0-pre-tailwind.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.1...@bloom-housing/public@2.0.0-pre-tailwind.2) (2021-10-21)


### Features

* adds jurisdiction filtering to listings ([#2027](https://github.com/bloom-housing/bloom/issues/2027)) ([219696b](https://github.com/bloom-housing/bloom/commit/219696ba784cfc079dd5aec74b24c3a8479160b6))





# [2.0.0-pre-tailwind.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/public@2.0.0-pre-tailwind.0...@bloom-housing/public@2.0.0-pre-tailwind.1) (2021-10-19)

### Bug Fixes

- Remove shared-helpers dependency from ui-components ([#2032](https://github.com/bloom-housing/bloom/issues/2032)) ([dba201f](https://github.com/bloom-housing/bloom/commit/dba201fa62523c59fc160addab793a7eac20609f))

# 2.0.0-pre-tailwind.0 (2021-10-19)

### Bug Fixes

- **backend:** Change tokenMissing to account already confirmed error … ([#1971](https://github.com/bloom-housing/bloom/issues/1971)) ([bc6ec92](https://github.com/bloom-housing/bloom/commit/bc6ec9243fb5be62ca8e240d96b828d418a9ee5b))
- **backend:** unitCreate and UnitUpdateDto now require only IdDto for… ([#1956](https://github.com/bloom-housing/bloom/issues/1956)) ([43dcfbe](https://github.com/bloom-housing/bloom/commit/43dcfbe7493bdd654d7b898ed9650804a016065c)), closes [#1897](https://github.com/bloom-housing/bloom/issues/1897)
- Netlify doesn't like specifying the start command in toml ([2691011](https://github.com/bloom-housing/bloom/commit/2691011cbd2512acce7bac0657119e5a41d399f0))
- New icons for notifications ([8da124a](https://github.com/bloom-housing/bloom/commit/8da124a1f8bf795badb6d5149081f694bec416be))
- Reponsive TW grid classes, nested overlays ([#1881](https://github.com/bloom-housing/bloom/issues/1881)) ([620ed1f](https://github.com/bloom-housing/bloom/commit/620ed1fbbf0466336a53ea233cdb0c3984eeda15))
- Show LM preview without building address ([#1960](https://github.com/bloom-housing/bloom/issues/1960)) ([2de0172](https://github.com/bloom-housing/bloom/commit/2de0172cec6f7df43259823f2b62bb165ec331fc))
- Translation typo in alternate contact page ([#1914](https://github.com/bloom-housing/bloom/issues/1914)) ([9792048](https://github.com/bloom-housing/bloom/commit/9792048dbf6469d641b938b712e9774853ca18f4))
- Updates from alameda ([#1958](https://github.com/bloom-housing/bloom/issues/1958)) ([37cea05](https://github.com/bloom-housing/bloom/commit/37cea05c2b61ce23ceda926da9a0751558252910))

### chore

- Add new `shared-helpers` package ([#1911](https://github.com/bloom-housing/bloom/issues/1911)) ([6e5d91b](https://github.com/bloom-housing/bloom/commit/6e5d91be5ccafd3d4b5bc1a578f2246a5e7f905b))

### Features

- Listings management draft and publish validation backend & frontend ([#1850](https://github.com/bloom-housing/bloom/issues/1850)) ([ef67997](https://github.com/bloom-housing/bloom/commit/ef67997a056c6f1f758d2fa67bf877d4a3d897ab))
- New subheader prop and custom class names on ListingCard ([e2ddbc7](https://github.com/bloom-housing/bloom/commit/e2ddbc776a0a9740f50a3bbfd7442f06597206dc))
- Responsive table refactor ([#1937](https://github.com/bloom-housing/bloom/issues/1937)) ([4c8b322](https://github.com/bloom-housing/bloom/commit/4c8b3221c68a7ed726c76bbf89781cff8c7b1626))
- Support PDF uploads or webpage links for building selection criteria ([#1893](https://github.com/bloom-housing/bloom/issues/1893)) ([8514b43](https://github.com/bloom-housing/bloom/commit/8514b43ba337d33cb877ff468bf780ff47fdc772))

### Performance Improvements

- Separates css imports and disables local purge ([#1883](https://github.com/bloom-housing/bloom/issues/1883)) ([668968e](https://github.com/bloom-housing/bloom/commit/668968e45072e9a5121af3cf32d0d8307c671907)), closes [#1882](https://github.com/bloom-housing/bloom/issues/1882)

### BREAKING CHANGES

- **backend:** POST/PUT /listings interface change
- Manually add totalFlagged until fixed
- Move form keys out of ui-components
- tableHeader prop on StandardTable moved into a new tableHeaderProps object that contains all the new
  header props
