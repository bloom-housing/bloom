# Changelog

All notable changes to this project will be documented in this file. The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

(_Note:_ it our intention to improve our release process going forward by using [Semantic Versioning](https://semver.org/spec/v2.0.0.html).)

## Unreleased

### General

### Backend

- Fixed:

  - Poor TypeORM performance in `/applications` endpoint ([#1131](https://github.com/bloom-housing/bloom/issues/1131)) (Michał Plebański)
  - POST `/users` endpoint response from StatusDTO to UserBasicDto (Michał Plebański)
  - Replaces `toPrecision` function on `units-transformations` to `toFixed` ([#1304](https://github.com/bloom-housing/bloom/pull/1304)) (Marcin Jędras)

- Added:

  - Added "closed" to ListingStatus enum
  - Added Transform to ListingStatus field to return closed if applicationDueDate is in the past
  - Added "ohaFormat" to CSV exporter (includes OHA and HOPWA preferences) ([#1292](https://github.com/bloom-housing/bloom/pull/1292)) (Michał Plebański)
  - `/assets` endpoints (create and createPresignedUploadMetadata)
  - "noEmailConfirmation" query param to `POST /users` endpoint
  - POST `/users` endpoint response from StatusDTO to UserBasicDto (Michał Plebański)

- Changed:

  - Cleanup seed data generation and add more variety ([#1312](https://github.com/bloom-housing/bloom/pull/1312)) Emily Jablonski

### Frontend

- Added:

  - Listings Management pieces added to Parnter's app, including add and detail pages
    - add accessible at `/listings/add`
    - detail page accessible at `/listings/[id]`
  - New unit summary breaks down units by both type and rent ([#1253](https://github.com/bloom-housing/bloom/pull/1253)) (Emily Jablonski)
  - Custom exclusive preference options ([#1272](https://github.com/bloom-housing/bloom/pull/1272)) (Emily Jablonski)
  - Optionally hide preferences from Listing page ([#1280](https://github.com/bloom-housing/bloom/pull/1280)) (Emily Jablonski)
  - Add ability for site header logo to have custom widths, image only ([#1346](https://github.com/bloom-housing/bloom/pull/1346)) (Emily Jablonski)
  - Created duplicates pages ([#1132](https://github.com/bloom-housing/bloom/pull/1132)) (Dominik Barcikowski)
  - Add Additional Details section to listing management ([#1338](https://github.com/bloom-housing/bloom/pull/1338)) (Emily Jablonski)

- Fixed:

  - Save application language in the choose-language step ([#1234](https://github.com/bloom-housing/bloom/pull/1234)) (Dominik Barcikowski)
  - Fixed broken Cypress tests on the CircleCI ([#1262](https://github.com/bloom-housing/bloom/pull/1262)) (Dominik Barcikowski)
  - Fix repetition of select text on preferences ([#1270](https://github.com/bloom-housing/bloom/pull/1270)) (Emily Jablonski)
  - Fix aplication submission and broken test ([#1270](https://github.com/bloom-housing/bloom/pull/1282)) (Dominik Barcikowski)
  - Fix broken application search in Partners ([#1301](https://github.com/bloom-housing/bloom/pull/1301)) (Dominik Barcikowski)
    <<<<<<< HEAD
    =======
  - Fix multiple unit rows in summaries, sorting issues ([#1306](https://github.com/bloom-housing/bloom/pull/1306)) (Emily Jablonski)
  - Fix partners application submission ([#1340](https://github.com/bloom-housing/bloom/pull/1340)) (Dominik Barcikowski)
    > > > > > > > upstream/master

- Changed:

  - Allow preferences to have optional descriptions and an optional generic decline ([#1267](https://github.com/bloom-housing/bloom/pull/1267)) Emily Jablonski
  - Refactored currency field logic to be generic & reusable ([#1356](https://github.com/bloom-housing/bloom/pull/1356)) Emily Jablonski

### UI Components

- Added:

  - Table image thumbnails component along with minimal left/right flush table styles ([#1339](https://github.com/bloom-housing/bloom/pull/1339)) (Jared White)
  - Tabs component based on React Tabs ([#1305](https://github.com/bloom-housing/bloom/pull/1305)) (Jared White)
    - **Note**: the previous `Tab` child of `TabNav` has been renamed to `TabNavItem`
  - Icon support for standard variants of Button component ([#1268](https://github.com/bloom-housing/bloom/pull/1268)) (Jared White)

- Fixed:

  - Correct LinkButton and other styles in Storybook ([#1309](https://github.com/bloom-housing/bloom/pull/1309)) (Jared White & Jesse James Arnold)

## 1.0.0 / 2021-05-21

### General

- Added:

  - This new Changelog format! =)
  - New GitHub template for pull requests ([#1208](https://github.com/bloom-housing/bloom/pull/1208)) (Sean Albert)
  - Add missing listing fields ([#1186](https://github.com/bloom-housing/bloom/pull/1186)) (Marcin Jędras)

- Changed:

  - Upgrade the public + partners apps to Next v10 along with new architectural patterns [#1087](https://github.com/bloom-housing/bloom/pull/1087))
    - **Breaking Change**: you will need to update any downstream app to Next 10 and provide a `NavigationContext` in order for the `ui-components` package to work. Also all handling of locales and i18n routing has been refactored to leverage Next 10.
    - If hosting on Netlify, make sure you've installed the Next plugin for SSR routes after upgrading to Next 10.
    - The `ui-components` package no longer has a dependency on Next and can be imported into generalized React codebases.
  - Dynamic preferences (switch from hardcoded preference options) ([#1167](https://github.com/bloom-housing/bloom/pull/1167)) (dominikx96)
  - Update license ([#1189](https://github.com/bloom-housing/bloom/pull/1189)) (Emily Jablonski)
  - Bump ssri from 6.0.1 to 6.0.2 ([#1194](https://github.com/bloom-housing/bloom/pull/1194)) (dependabot)

- Fixed:

  - StandardTable translation issue and BMR display ([#1203](https://github.com/bloom-housing/bloom/pull/1194)) (Emily Jablonski)

### Backend

- Added:

  - Missing resident state to CSV formatters ([#1223](https://github.com/bloom-housing/bloom/pull/1223)) (Michał Plebański)
  - ENV variables to control rate limits ([#1155](https://github.com/bloom-housing/bloom/pull/1155)) (Bartłomiej Ponikiewski)
    - Adjust via THROTTLE_TTL and THROTTLE_LIMIT
  - User language ([#1181](https://github.com/bloom-housing/bloom/pull/1181)) (Michał Plebański)
  - ApiProperty to files that have no .dto.ts suffixes ([#1180](https://github.com/bloom-housing/bloom/pull/1180)) (Michał Plebański)
  - Get AFS by id and pagination meta for totalFlagged ([#1137](https://github.com/bloom-housing/bloom/pull/1137)) (Michał Plebański)
  - Translations module and county codes for frontend ([#1145](https://github.com/bloom-housing/bloom/pull/1145)) (Michał Plebański)

- Changed:

  - Bump handlebars from 4.7.6 to 4.7.7 ([#1218](https://github.com/bloom-housing/bloom/pull/1218)) (dependabot)
  - Downgrade nestjs/swagger ([#1188](https://github.com/bloom-housing/bloom/pull/1188)) (Michał Plebański)
  - Refactor: backend directories structure ([#1166](https://github.com/bloom-housing/bloom/pull/1166)) (Michał Plebański)

### Frontend

- Added:

  - Make additional eligibility sections optional ([#1213](https://github.com/bloom-housing/bloom/pull/1213)) (Emily Jablonski)
  - Support rent as percent income ([#1195](https://github.com/bloom-housing/bloom/pull/1195)) (Emily Jablonski)

- Fixed:

  - Add spinner to the Application Form terms page upon submit ([#1225](https://github.com/bloom-housing/bloom/pull/1225)) (Jared White)
    - The loading overlay in ui-components was updated to use the same spinner as the button component
  - Birthdate localizing issues ([#1202](https://github.com/bloom-housing/bloom/pull/1202))
  - Preferences translations in Partners ([#1206](https://github.com/bloom-housing/bloom/pull/1206)) (dominikx96)
  - Referral application section on mobile ([#1201](https://github.com/bloom-housing/bloom/pull/1201))
  - Use correct listingId when redirecting from Sign In ([#1147](https://github.com/bloom-housing/bloom/pull/1147)) (Jared White)
  - Flaky cypress tests ([#1115](https://github.com/bloom-housing/bloom/pull/1115)) (Emily Jablonski)
  - 404 issues in my application and settings ([#1164](https://github.com/bloom-housing/bloom/pull/1164)) (Emily Jablonski)

### UI Components

- Added:

  - New application autofill translations ([#1196](https://github.com/bloom-housing/bloom/pull/1196)) (Emily Jablonski)
  - New referral component ([#1146](https://github.com/bloom-housing/bloom/pull/1146)) (Emily Jablonski)

- Changed:

  - Use translated strings on responsive table headers ([#1128](https://github.com/bloom-housing/bloom/pull/1128)) (Jared White)

## 0.3.11 / 2021-04-22

### General

- Added:

  - LICENSE.txt for AGPL ([#1100](https://github.com/bloom-housing/bloom/pull/1100)) (Emily Jablonski)

- Changed:

  - Bump elliptic from 6.5.3 to 6.5.4 ([#1062](https://github.com/bloom-housing/bloom/pull/1062)) (dependabot)
  - Bump y18n from 4.0.0 to 4.0.1 ([#1093](https://github.com/bloom-housing/bloom/pull/1093)) (dependabot)

### Backend

- Added:

  - Applications rate limit ([#1103](https://github.com/bloom-housing/bloom/pull/1103)) (Bartłomiej Ponikiewski)
  - Add 3rd listing with 0 preferences ([#1124](https://github.com/bloom-housing/bloom/pull/1124)) (Michał Plebański)
  - Better support for applications search ([#1092](https://github.com/bloom-housing/bloom/pull/1092)) (Bartłomiej Ponikiewski)
  - Missing address and workAddress as joins to application householdMembers ([#1107](https://github.com/bloom-housing/bloom/pull/1107)) (Bartłomiej Ponikiewski)
  - includeDemographics query param to CSV exporter ([#1031](https://github.com/bloom-housing/bloom/pull/1031)) (Michał Plebański)

- Changed:

  - Move business logic from controller to service ([#1125](https://github.com/bloom-housing/bloom/pull/1125)) (Michał Plebański)
  - Applications duplicate logic ([#1096](https://github.com/bloom-housing/bloom/pull/1096)) (Michał Plebański)
  - Improve seeds ([#1110](https://github.com/bloom-housing/bloom/pull/1110)) (Michał Plebański)

- Removed:

  - Redundant residence zip in CSV exporter ([#1056](https://github.com/bloom-housing/bloom/pull/1056)) (Michał Plebański)

- Fixed:

  - Add exception handling in \_encodeDoubleQuotes ([#1141](https://github.com/bloom-housing/bloom/pull/1141)) (Michał Plebański)
  - Cypress-node missing redis related envs ([#1136](https://github.com/bloom-housing/bloom/pull/1136)) (Michał Plebański)
  - User service making use of env.SECRET instead of env.APP_SECRET ([#1108](https://github.com/bloom-housing/bloom/pull/1108)) (Michał Plebański)
  - Order of application list ([#1063](https://github.com/bloom-housing/bloom/pull/1063)) (Bartłomiej Ponikiewski)
  - MaxLength validations for alternateContact ([#1057](https://github.com/bloom-housing/bloom/pull/1057)) (Michał Plebański)

### Frontend

- Added:

  - Clean up aside block styling and add missing mobile blocks ([#1140](https://github.com/bloom-housing/bloom/pull/1140)) (Jared White)
  - Autofill applications for signed in users ([#1111](https://github.com/bloom-housing/bloom/pull/1111)) (Jared White)
  - Account settings ([#1106](https://github.com/bloom-housing/bloom/pull/1106)) (Emily Jablonski)
  - My Applications loading state ([#1121](https://github.com/bloom-housing/bloom/pull/1121)) (Emily Jablonski)
  - Missing translation for account audit ([#1116](https://github.com/bloom-housing/bloom/pull/1116)) (Marcin Jędras)
  - My Applications screen ([#1079](https://github.com/bloom-housing/bloom/pull/1079)) (Emily Jablonski)
  - CSV export error message ([#1104](https://github.com/bloom-housing/bloom/pull/1104)) (dominikx96)
  - Loading state for csv export ([#1060](https://github.com/bloom-housing/bloom/pull/1060)) (dominikx96)
  - Filters to the ada and preferences ([#1039](https://github.com/bloom-housing/bloom/pull/1039)) (dominikx96)

- Changed:

  - Improved Create Account flow based on audit ([#1089](https://github.com/bloom-housing/bloom/pull/1089)) (Marcin Jędras)
  - Tweak sizes for application table columns ([#1048](https://github.com/bloom-housing/bloom/pull/1048)) (Jared White)

- Fixed:

  - Broken Cypress tests on master ([#1138](https://github.com/bloom-housing/bloom/pull/1138)) (Emily Jablonski)
  - Message after account confirmation ([#1122](https://github.com/bloom-housing/bloom/pull/1122)) (Marcin Jędras)
  - useRouter for confirmation ([#1114](https://github.com/bloom-housing/bloom/pull/1114)) (Marcin Jędras)
  - Household maximum income translations on mobile view ([#1091](https://github.com/bloom-housing/bloom/pull/1091)) (Netra Badami)
  - Annual and monthly income values in the applications table ([#1069](https://github.com/bloom-housing/bloom/pull/1069)) (dominikx96)
  - Fixes to date format, allow markup for street, add lottery time ([#1064](https://github.com/bloom-housing/bloom/pull/1064)) (Marcin Jędras)

### UI Components

- Added:

  - New unit test suite ([#1050](https://github.com/bloom-housing/bloom/pull/1050)) (Emily Jablonski)
  - Lottery results section ([#1034](https://github.com/bloom-housing/bloom/pull/1034)) (Marcin Jędras)

- Changed:

  - Updated translations ([#1109](https://github.com/bloom-housing/bloom/pull/1109)) (dominikx96)
  - Translation to Displacee Tenant ([#1061](https://github.com/bloom-housing/bloom/pull/1061)) (dominikx96)
  - Updates for public lottery and open house ([#1058](https://github.com/bloom-housing/bloom/pull/1058)) (Marcin Jędras)

- Removed:

  - Self package reference ([#1123](https://github.com/bloom-housing/bloom/pull/1123)) (James Wills)
  - Storyshots functionality ([#1101](https://github.com/bloom-housing/bloom/pull/1101)) (Jared White)

- Fixed:

  - Add missing string ([#1143](https://github.com/bloom-housing/bloom/pull/1143)) (Emily Jablonski)

## 0.3.10 / 2021-03-04

## 0.3.9 / 2021-02-16
