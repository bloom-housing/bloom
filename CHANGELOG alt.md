# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

(_Note:_ it our intention to improve our release process going forward by using [Semantic Versioning](https://semver.org/spec/v2.0.0.html).)

## Unreleased

### Added

- This new Changelog format! =)

- Backend:

  - ApiProperty to files that have no .dto.ts suffixes ([#1180](https://github.com/bloom-housing/bloom/pull/1180)) (Michał Plebański)
  - Get AFS by id and pagination meta for totalFlagged ([#1137](https://github.com/bloom-housing/bloom/pull/1137)) (Michał Plebański)
  - Translations module and county codes for frontend ([#1145](https://github.com/bloom-housing/bloom/pull/1145)) (Michał Plebański)

- UI Components:

  - New referral component ([#1146](https://github.com/bloom-housing/bloom/pull/1146)) (Emily Jablonski)

### Changed

- Update license ([#1189](https://github.com/bloom-housing/bloom/pull/1189)) (Emily Jablonski)

- Backend:

  - Downgrade nestjs/swagger ([#1188](https://github.com/bloom-housing/bloom/pull/1188)) (Michał Plebański)
  - Refactor: backend directories structure ([#1166](https://github.com/bloom-housing/bloom/pull/1166)) (Michał Plebański)

- UI Components:

  - Use translated strings on responsive table headers ([#1128](https://github.com/bloom-housing/bloom/pull/1128)) (Jared White)

### Fixed

- Frontend:

  - Flaky cypress tests ([#1115](https://github.com/bloom-housing/bloom/pull/1115)) (Emily Jablonski)
  - 404 issues in my application and settings ([#1164](https://github.com/bloom-housing/bloom/pull/1164)) (Emily Jablonski)

## 0.3.11 / 2021-04-22

### Added

- LICENSE.txt for AGPL ([#1100](https://github.com/bloom-housing/bloom/pull/1100)) (Emily Jablonski)

- Backend:

  - Applications rate limit ([#1103](https://github.com/bloom-housing/bloom/pull/1103)) (Bartłomiej Ponikiewski)
  - Add 3rd listing with 0 preferences ([#1124](https://github.com/bloom-housing/bloom/pull/1124)) (Michał Plebański)
  - Better support for applications search ([#1092](https://github.com/bloom-housing/bloom/pull/1092)) (Bartłomiej Ponikiewski)
  - Missing address and workAddress as joins to application householdMembers ([#1107](https://github.com/bloom-housing/bloom/pull/1107)) (Bartłomiej Ponikiewski)
  - includeDemographics query param to CSV exporter ([#1031](https://github.com/bloom-housing/bloom/pull/1031)) (Michał Plebański)

- Frontend:

  - Clean up aside block styling and add missing mobile blocks ([#1140](https://github.com/bloom-housing/bloom/pull/1140)) (Jared White)
  - Autofill applications for signed in users ([#1111](https://github.com/bloom-housing/bloom/pull/1111)) (Jared White)
  - Account settings ([#1106](https://github.com/bloom-housing/bloom/pull/1106)) (Emily Jablonski)
  - My Applications loading state ([#1121](https://github.com/bloom-housing/bloom/pull/1121)) (Emily Jablonski)
  - Missing translation for account audit ([#1116](https://github.com/bloom-housing/bloom/pull/1116)) (Marcin Jędras)
  - My Applications screen ([#1079](https://github.com/bloom-housing/bloom/pull/1079)) (Emily Jablonski)
  - CSV export error message ([#1104](https://github.com/bloom-housing/bloom/pull/1104)) (dominikx96)
  - Loading state for csv export ([#1060](https://github.com/bloom-housing/bloom/pull/1060)) (dominikx96)
  - Filters to the ada and preferences ([#1039](https://github.com/bloom-housing/bloom/pull/1039)) (dominikx96)

- UI Components:

  - New unit test suite ([#1050](https://github.com/bloom-housing/bloom/pull/1050)) (Emily Jablonski)
  - Lottery results section ([#1034](https://github.com/bloom-housing/bloom/pull/1034)) (Marcin Jędras)

### Changed

- Bump elliptic from 6.5.3 to 6.5.4 ([#1062](https://github.com/bloom-housing/bloom/pull/1062)) (dependabot)
- Bump y18n from 4.0.0 to 4.0.1 ([#1093](https://github.com/bloom-housing/bloom/pull/1093)) (dependabot)

- Backend:

  - Move business logic from controller to service ([#1125](https://github.com/bloom-housing/bloom/pull/1125)) (Michał Plebański)
  - Applications duplicate logic ([#1096](https://github.com/bloom-housing/bloom/pull/1096)) (Michał Plebański)
  - Improve seeds ([#1110](https://github.com/bloom-housing/bloom/pull/1110)) (Michał Plebański)

- Frontend:

  - Improved Create Account flow based on audit ([#1089](https://github.com/bloom-housing/bloom/pull/1089)) (Marcin Jędras)
  - Tweak sizes for application table columns ([#1048](https://github.com/bloom-housing/bloom/pull/1048)) (Jared White)

UI Components:

- Updated translations ([#1109](https://github.com/bloom-housing/bloom/pull/1109)) (dominikx96)
- Translation to Displacee Tenant ([#1061](https://github.com/bloom-housing/bloom/pull/1061)) (dominikx96)
- Updates for public lottery and open house ([#1058](https://github.com/bloom-housing/bloom/pull/1058)) (Marcin Jędras)

### Removed

- Backend:

  - Redundant residence zip in CSV exporter ([#1056](https://github.com/bloom-housing/bloom/pull/1056)) (Michał Plebański)

- UI Components:

  - Self package reference ([#1123](https://github.com/bloom-housing/bloom/pull/1123)) (James Wills)
  - Storyshots functionality ([#1101](https://github.com/bloom-housing/bloom/pull/1101)) (Jared White)

### Fixed

- Backend

  - Add exception handling in \_encodeDoubleQuotes ([#1141](https://github.com/bloom-housing/bloom/pull/1141)) (Michał Plebański)
  - Cypress-node missing redis related envs ([#1136](https://github.com/bloom-housing/bloom/pull/1136)) (Michał Plebański)
  - User service making use of env.SECRET instead of env.APP_SECRET ([#1108](https://github.com/bloom-housing/bloom/pull/1108)) (Michał Plebański)
  - Order of application list ([#1063](https://github.com/bloom-housing/bloom/pull/1063)) (Bartłomiej Ponikiewski)
  - MaxLength validations for alternateContact ([#1057](https://github.com/bloom-housing/bloom/pull/1057)) (Michał Plebański)

- Frontend

  - Broken Cypress tests on master ([#1138](https://github.com/bloom-housing/bloom/pull/1138)) (Emily Jablonski)
  - Message after account confirmation ([#1122](https://github.com/bloom-housing/bloom/pull/1122)) (Marcin Jędras)
  - useRouter for confirmation ([#1114](https://github.com/bloom-housing/bloom/pull/1114)) (Marcin Jędras)
  - Household maximum income translations on mobile view ([#1091](https://github.com/bloom-housing/bloom/pull/1091)) (Netra Badami)
  - Annual and monthly income values in the applications table ([#1069](https://github.com/bloom-housing/bloom/pull/1069)) (dominikx96)
  - Fixes to date format, allow markup for street, add lottery time ([#1064](https://github.com/bloom-housing/bloom/pull/1064)) (Marcin Jędras)

- UI Components

  - Add missing string ([#1143](https://github.com/bloom-housing/bloom/pull/1143)) (Emily Jablonski)

## 0.3.10 / 2021-03-04

## 0.3.9 / 2021-02-16
