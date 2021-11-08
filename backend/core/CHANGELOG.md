# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.1-alpha.0...@bloom-housing/backend-core@3.0.1-alpha.1) (2021-11-08)


### Features

* **backend:** extend UserUpdateDto to support email change with confirmation ([#2120](https://github.com/bloom-housing/bloom/issues/2120)) ([3e1fdbd](https://github.com/bloom-housing/bloom/commit/3e1fdbd0ea91d4773973d5c485a5ba61303db90a))





## [3.0.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@3.0.0...@bloom-housing/backend-core@3.0.1-alpha.0) (2021-11-05)


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





# [3.0.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.7...@bloom-housing/backend-core@3.0.0) (2021-11-05)

**Note:** Version bump only for package @bloom-housing/backend-core





## [2.0.1-alpha.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.6...@bloom-housing/backend-core@2.0.1-alpha.7) (2021-11-05)

**Note:** Version bump only for package @bloom-housing/backend-core





## [2.0.1-alpha.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.5...@bloom-housing/backend-core@2.0.1-alpha.6) (2021-11-04)


### Reverts

* Revert "refactor: listing preferences and adds jurisdictional filtering" ([41f72c0](https://github.com/bloom-housing/bloom/commit/41f72c0db49cf94d7930f5cfc88f6ee9d6040986))





## [2.0.1-alpha.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.4...@bloom-housing/backend-core@2.0.1-alpha.5) (2021-11-04)


### Bug Fixes

* **backend:** make it possible to filter portal users in /users endpoint ([#2078](https://github.com/bloom-housing/bloom/issues/2078)) ([29bf714](https://github.com/bloom-housing/bloom/commit/29bf714d28755916ec8ec896366c8c32c3a227c4))





## [2.0.1-alpha.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.3...@bloom-housing/backend-core@2.0.1-alpha.4) (2021-11-04)


### Features

* Updates application confirmation numbers ([#2072](https://github.com/bloom-housing/bloom/issues/2072)) ([75cd67b](https://github.com/bloom-housing/bloom/commit/75cd67bcb62280936bdeeaee8c9b7b2583a1339d))





## [2.0.1-alpha.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.2...@bloom-housing/backend-core@2.0.1-alpha.3) (2021-11-03)

**Note:** Version bump only for package @bloom-housing/backend-core





## [2.0.1-alpha.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.1...@bloom-housing/backend-core@2.0.1-alpha.2) (2021-11-03)


### Bug Fixes

* don't send email confirmation on paper app submission ([#2110](https://github.com/bloom-housing/bloom/issues/2110)) ([7f83b70](https://github.com/bloom-housing/bloom/commit/7f83b70327049245ecfba04ae3aea4e967929b2a))





## [2.0.1-alpha.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.1-alpha.0...@bloom-housing/backend-core@2.0.1-alpha.1) (2021-11-03)


### Features

* jurisdictional email signatures ([#2111](https://github.com/bloom-housing/bloom/issues/2111)) ([7a146ff](https://github.com/bloom-housing/bloom/commit/7a146ffb5de88cfa2950e2a469a99e38d71b33c8))





## [2.0.1-alpha.0](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0...@bloom-housing/backend-core@2.0.1-alpha.0) (2021-11-02)


### Features

* two new common app questions - Household Changes and Household Student ([#2070](https://github.com/bloom-housing/bloom/issues/2070)) ([42a752e](https://github.com/bloom-housing/bloom/commit/42a752ec073c0f5b65374c7a68da1e34b0b1c949))





# [2.0.0](https://github.com/seanmalbert/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.16...@bloom-housing/backend-core@2.0.0) (2021-11-02)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.16](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.15...@bloom-housing/backend-core@2.0.0-pre-tailwind.16) (2021-11-02)


### Code Refactoring

* listing preferences and adds jurisdictional filtering ([9f661b4](https://github.com/bloom-housing/bloom/commit/9f661b43921ec939bd1bf5709c934ad6f56dd859))


### BREAKING CHANGES

* updates preference relationship with listings





# [2.0.0-pre-tailwind.15](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.14...@bloom-housing/backend-core@2.0.0-pre-tailwind.15) (2021-11-01)


### Bug Fixes

* reverts preferences to re-add as breaking/major bump ([508078e](https://github.com/bloom-housing/bloom/commit/508078e16649e4d5f669273c50ef62407aab995f))
* reverts preferences to re-add as breaking/major bump ([4f7d893](https://github.com/bloom-housing/bloom/commit/4f7d89327361b3b28b368c23cfd24e6e8123a0a8))





# [2.0.0-pre-tailwind.14](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.13...@bloom-housing/backend-core@2.0.0-pre-tailwind.14) (2021-10-30)


### Bug Fixes

* updates household member count ([#2112](https://github.com/bloom-housing/bloom/issues/2112)) ([3dee0f7](https://github.com/bloom-housing/bloom/commit/3dee0f7d676ff42d546ecf83a17659cd69d7e1bc))





# [2.0.0-pre-tailwind.13](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.12...@bloom-housing/backend-core@2.0.0-pre-tailwind.13) (2021-10-30)


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





# [2.0.0-pre-tailwind.12](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.11...@bloom-housing/backend-core@2.0.0-pre-tailwind.12) (2021-10-29)


### Bug Fixes

* fix for csv demographics and preference patch ([4768fb0](https://github.com/bloom-housing/bloom/commit/4768fb00be55957b3b1b197d149187c79374b48d))





# [2.0.0-pre-tailwind.11](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.10...@bloom-housing/backend-core@2.0.0-pre-tailwind.11) (2021-10-28)


### Bug Fixes

* in listings management keep empty strings, remove empty objects ([#2064](https://github.com/bloom-housing/bloom/issues/2064)) ([c4b1e83](https://github.com/bloom-housing/bloom/commit/c4b1e833ec128f457015ac7ffa421ee6047083d9))





# [2.0.0-pre-tailwind.10](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.9...@bloom-housing/backend-core@2.0.0-pre-tailwind.10) (2021-10-27)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.9](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.8...@bloom-housing/backend-core@2.0.0-pre-tailwind.9) (2021-10-26)


### Bug Fixes

* Incorrect listing status ([#2015](https://github.com/bloom-housing/bloom/issues/2015)) ([48aa14e](https://github.com/bloom-housing/bloom/commit/48aa14eb522cb8e4d0a25fdeadcc392b30d7f1a9))





# [2.0.0-pre-tailwind.8](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.7...@bloom-housing/backend-core@2.0.0-pre-tailwind.8) (2021-10-22)


### Bug Fixes

* alternate contact email now validated ([#2035](https://github.com/bloom-housing/bloom/issues/2035)) ([b411695](https://github.com/bloom-housing/bloom/commit/b411695350f8f8de39c6994f2fac2fcb4678f678))





# [2.0.0-pre-tailwind.7](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.6...@bloom-housing/backend-core@2.0.0-pre-tailwind.7) (2021-10-22)


### Bug Fixes

* makes listing programs optional ([fbe7134](https://github.com/bloom-housing/bloom/commit/fbe7134348e59e3fdb86663cfdca7648655e7b4b))





# [2.0.0-pre-tailwind.6](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.5...@bloom-housing/backend-core@2.0.0-pre-tailwind.6) (2021-10-22)


### Features

* **backend:** add Program entity ([#1968](https://github.com/bloom-housing/bloom/issues/1968)) ([492ec4d](https://github.com/bloom-housing/bloom/commit/492ec4d333cf9b73af772a1aceed29813f405ba0)), closes [#2034](https://github.com/bloom-housing/bloom/issues/2034)





# [2.0.0-pre-tailwind.5](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.4...@bloom-housing/backend-core@2.0.0-pre-tailwind.5) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.4](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.3...@bloom-housing/backend-core@2.0.0-pre-tailwind.4) (2021-10-22)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.3](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.2...@bloom-housing/backend-core@2.0.0-pre-tailwind.3) (2021-10-21)

**Note:** Version bump only for package @bloom-housing/backend-core





# [2.0.0-pre-tailwind.2](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.1...@bloom-housing/backend-core@2.0.0-pre-tailwind.2) (2021-10-21)


### Bug Fixes

* **backend:** enforces lower casing of emails ([#1972](https://github.com/bloom-housing/bloom/issues/1972)) ([2608e82](https://github.com/bloom-housing/bloom/commit/2608e8228830a2fc7e6b522c73cb587adbb5803b))
* migration fix ([#2043](https://github.com/bloom-housing/bloom/issues/2043)) ([ffa4d45](https://github.com/bloom-housing/bloom/commit/ffa4d45e0f53ce071fc4dcf8079c06cf5e836ed3))


### Features

* adds jurisdiction filtering to listings ([#2027](https://github.com/bloom-housing/bloom/issues/2027)) ([219696b](https://github.com/bloom-housing/bloom/commit/219696ba784cfc079dd5aec74b24c3a8479160b6))
* **backend:** add languages (Language[]) to Jurisdiction entity ([#1998](https://github.com/bloom-housing/bloom/issues/1998)) ([9ceed24](https://github.com/bloom-housing/bloom/commit/9ceed24d48b14888e6ea59b421b409f875d12b01))
* **backend:** Add user delete endpoint and expose leasingAgentInList… ([#1996](https://github.com/bloom-housing/bloom/issues/1996)) ([a13f735](https://github.com/bloom-housing/bloom/commit/a13f73574b470beff2f8948abb226a6786856480))
* **backend:** make use of new application confirmation codes ([#2014](https://github.com/bloom-housing/bloom/issues/2014)) ([3c45c29](https://github.com/bloom-housing/bloom/commit/3c45c2904818200eed4568931d4cc352fd2f449e))
* **backend:** try fixing SETEX redis e2e tests flakiness ([#2044](https://github.com/bloom-housing/bloom/issues/2044)) ([4087c53](https://github.com/bloom-housing/bloom/commit/4087c532ddba672a415a048f4362e509aba7fd7f))





# [2.0.0-pre-tailwind.1](https://github.com/bloom-housing/bloom/compare/@bloom-housing/backend-core@2.0.0-pre-tailwind.0...@bloom-housing/backend-core@2.0.0-pre-tailwind.1) (2021-10-19)

**Note:** Version bump only for package @bloom-housing/backend-core

# 2.0.0-pre-tailwind.0 (2021-10-19)

### Bug Fixes

- **backend:** Change tokenMissing to account already confirmed error … ([#1971](https://github.com/bloom-housing/bloom/issues/1971)) ([bc6ec92](https://github.com/bloom-housing/bloom/commit/bc6ec9243fb5be62ca8e240d96b828d418a9ee5b))
- **backend:** totalFlagged from AFS missing in swagger documentation ([#1997](https://github.com/bloom-housing/bloom/issues/1997)) ([0abf5dd](https://github.com/bloom-housing/bloom/commit/0abf5ddefe8d4f33a895fe3faf59d43316f56003))
- **backend:** unitCreate and UnitUpdateDto now require only IdDto for… ([#1956](https://github.com/bloom-housing/bloom/issues/1956)) ([43dcfbe](https://github.com/bloom-housing/bloom/commit/43dcfbe7493bdd654d7b898ed9650804a016065c)), closes [#1897](https://github.com/bloom-housing/bloom/issues/1897)
- Fix dev seeds with new priority types ([#1920](https://github.com/bloom-housing/bloom/issues/1920)) ([b01bd7c](https://github.com/bloom-housing/bloom/commit/b01bd7ca2c1ba3ba7948ad8213a0939375003d90))
- Fix maps unit max occupancy to household size ([d1fefcf](https://github.com/bloom-housing/bloom/commit/d1fefcf2ea20cccf90375881c2a19d51bf986678))
- Fixes reserved community type import ([e5b0e25](https://github.com/bloom-housing/bloom/commit/e5b0e25f556af6cdcdf05d79825736dddcd1e105))
- Fixes unit types for max income ([87f018a](https://github.com/bloom-housing/bloom/commit/87f018a410657037a7c9a74a93ec6dbac6b42dec))
- Fixes unit types for max income ([#2013](https://github.com/bloom-housing/bloom/issues/2013)) ([b8966a1](https://github.com/bloom-housing/bloom/commit/b8966a19ea79012456f7f28d01c34b32d6f207bb))
- Multiple ami charts should show a max not a range ([#1925](https://github.com/bloom-housing/bloom/issues/1925)) ([142f436](https://github.com/bloom-housing/bloom/commit/142f43697bff23d2f59c7897d51ced83a2003308))
- Plus one to maxHouseholdSize for bmr ([401c956](https://github.com/bloom-housing/bloom/commit/401c956b0e885d3485b427622b82b85fd9a5f8b1))
- Removes 150 char limit on textarea fields ([6eb7036](https://github.com/bloom-housing/bloom/commit/6eb70364409c5910aa9b8277b37a8214c2a94358))
- Removes nested validation from applicationAddress ([747fd83](https://github.com/bloom-housing/bloom/commit/747fd836a9b5b8333a6586727b00c5674ef87a86))
- Update alameda's notification sign up URL ([#1874](https://github.com/bloom-housing/bloom/issues/1874)) ([3eb85fc](https://github.com/bloom-housing/bloom/commit/3eb85fccf7521e32f3d1f369e706cec0c078b536))

### Features

- **backend:** Add jurisdiction relation to ami charts entity ([#1905](https://github.com/bloom-housing/bloom/issues/1905)) ([1f13985](https://github.com/bloom-housing/bloom/commit/1f13985142c7908b4c37eaf0fbbbad0ad660f014))
- **backend:** Add jurisidction relation to ReservedCommunittType Entity ([#1889](https://github.com/bloom-housing/bloom/issues/1889)) ([9b0fe73](https://github.com/bloom-housing/bloom/commit/9b0fe73fe9ed1349584e119f235cb66f6e68785f))
- Listings management draft and publish validation backend & frontend ([#1850](https://github.com/bloom-housing/bloom/issues/1850)) ([ef67997](https://github.com/bloom-housing/bloom/commit/ef67997a056c6f1f758d2fa67bf877d4a3d897ab))
- Support PDF uploads or webpage links for building selection criteria ([#1893](https://github.com/bloom-housing/bloom/issues/1893)) ([8514b43](https://github.com/bloom-housing/bloom/commit/8514b43ba337d33cb877ff468bf780ff47fdc772))

### Performance Improvements

- **applications and flagged sets:** Adds indexes and updates listWit… ([#2003](https://github.com/bloom-housing/bloom/issues/2003)) ([f9efb15](https://github.com/bloom-housing/bloom/commit/f9efb15b930865b517249d5dc525c11d68dc251d))

### Reverts

- Revert "latest dev (#1999)" ([73a2789](https://github.com/bloom-housing/bloom/commit/73a2789d8f133f2d788e2399faa42b374d74ab15)), closes [#1999](https://github.com/bloom-housing/bloom/issues/1999)
- **backend:** Revert some listing filters ([#1984](https://github.com/bloom-housing/bloom/issues/1984)) ([14847e1](https://github.com/bloom-housing/bloom/commit/14847e1a797930f3e30bd945a2617dec2e3d679f))

### BREAKING CHANGES

- POST/PUT /listings interface change
- Manually add totalFlagged until fixed
