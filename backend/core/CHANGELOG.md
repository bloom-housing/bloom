# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
