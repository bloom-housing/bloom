# Changelog

All notable changes to this project will be documented in this file. The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

(_Note:_ it our intention to improve our release process going forward by using [Semantic Versioning](https://semver.org/spec/v2.0.0.html).)

## Detroit Team M9

- Fixed:

  - Cypress tests for `sites/public` ([#171](https://github.com/CityOfDetroit/bloom/issues/171))
  - Change the COUNTY_CODE to Detroit ([#351](https://github.com/CityOfDetroit/bloom/pull/351))

- Added:
  - Added fields to Listing and Property to accommodate Detroit listing data ([#311](https://github.com/CityOfDetroit/bloom/pull/311))
  - Add eligibility questionnaire validation ([#327](https://github.com/CityOfDetroit/bloom/pull/327))
  - Add support for comma-separated lists to filters ([#356](https://github.com/CityOfDetroit/bloom/pull/356))
  - Add eligibility questionnaire state management and back buttons ([#371](https://github.com/CityOfDetroit/bloom/pull/371))
  - Detroit seed properties ([#362](https://github.com/CityOfDetroit/bloom/pull/362))
  - Add bedrooms/unit size filter to backend ([#368](https://github.com/CityOfDetroit/bloom/pull/368))

## Detroit Team M8

- Added:
  - Made `addFilters()` more generic ([#257](https://github.com/CityOfDetroit/bloom/pull/257))
  - Fixed lowercaseing issue in query built by `addFilters()` ([#264](https://github.com/CityOfDetroit/bloom/pull/264))
  - Move where clauses and pagination to subquery, so filtered results return all listing data ([#271](https://github.com/CityOfDetroit/bloom/pull/271))

## Detroit Team M7

- Added:
  - Debug flags for public and partner site ([#195](https://github.com/CityOfDetroit/bloom/pull/195))
  - Upstream filter param parsing, with changes to support pagination params and filters that aren't on the listings table ([#180](https://github.com/CityOfDetroit/bloom/pull/180))
  - Eligibility questionnaire ([#154](https://github.com/CityOfDetroit/bloom/pull/154), [#198](https://github.com/CityOfDetroit/bloom/pull/198), [#208](https://github.com/CityOfDetroit/bloom/pull/208))

## Unreleased

## Frontend

- Added:

  - Update buttons / pages visibility depending on a user role ([#1609](https://github.com/bloom-housing/bloom/pull/1609)) (Dominik Barcikowski)

- Fixed:
  - Update Listings component to sort listings by status ([#1585](https://github.com/bloom-housing/bloom/pull/1585))

### UI Components

- Added:
  - Add ResponsiveTable for pricing

### Backend

- Added:

  - Filtering, pagination, and tests for listings endpoint (Parts of Detroit Team [#18](https://github.com/CityOfDetroit/bloom/pull/18), [#133](https://github.com/CityOfDetroit/bloom/pull/133), [#180](https://github.com/CityOfDetroit/bloom/pull/180), [#257](https://github.com/CityOfDetroit/bloom/pull/257), [#264](https://github.com/CityOfDetroit/bloom/pull/264), [#271](https://github.com/CityOfDetroit/bloom/pull/271)) [#1578](https://github.com/CityOfDetroit/bloom/pull/1578)

- Changed:

  - updated listing's importer to handle latest unit and priority types changes ([#1584](https://github.com/bloom-housing/bloom/pull/1584)) (Marcin Jedras)

- Fixed:
  - Added checks for property in listing.dto transforms

## v1.0.5 08/03/2021

- Added:
  - Debug flags for public and partner site ([Detroit Team #195](https://github.com/CityOfDetroit/bloom/pull/195), [#1519](https://github.com/bloom-housing/bloom/pull/1519))

### Backend

- Added:

  - /applicationMethods and /paperApplications endpoints and corresponding DB schema

- Fixed:

  - optional fields not being marked as optional in frontend client (missing '?' indicator) ([#1470](https://github.com/bloom-housing/bloom/pull/1470))
  - add duplicates to CSV export ([#1352](https://github.com/bloom-housing/bloom/issues/1352))
  - unit summaries transformations after a regression coming from separating unitTypes from jsonb column into a table

- Changed:

  - User module has been removed and incorporated into Auth module
  - convert listing events jsonb column to separate listing_events table
  - convert listing address jsonb columns to separate address tables
  - removed unused inverse relations from entities
  - recreated foreign keys constraints for `application_flagged_set_applications_applications`, `listings_leasing_agents_user_accounts`, `property_group_properties_property` and add missing `NOT NULL` migration for listing name column
  - Listing applicationMethods jsonb column has been converted to a separate table

- Added:
  - ability for an admin to confirm users by `/users` POST/PUT methods

### Frontend

- Fixed:

  - refactors listing form submit to fix double submit issue ([#1501](https://github.com/bloom-housing/bloom/pull/1501))

- Added:

  - A notice bar to the preview page of a listing ([#1532](https://github.com/bloom-housing/bloom/pull/1532)) (Jared White)
  - Photo upload and preview to the Partner Listing screens ([#1491](https://github.com/bloom-housing/bloom/pull/1491)) (Jared White)
  - AG-grid sorting now is connected with the backend sorting ([#1083](https://github.com/bloom-housing/bloom/issues/1083)) (Michał Plebański)
  - Add Preferences section to listing management ([#1564](https://github.com/bloom-housing/bloom/pull/1564)) (Emily Jablonski)
  - Add Community Type to listing management ([#1540](https://github.com/bloom-housing/bloom/pull/1540)) (Emily Jablonski)

- Changed:
  - Remove coming soon text, use application open text instead ([#1602](https://github.com/bloom-housing/bloom/pull/1602)) (Emily Jablonski)

### UI Components

- Fixed:

  - Fix a11y language navigation ([#1528](https://github.com/bloom-housing/bloom/pull/1528)) (Dominik Barcikowski)
  - Update default mobile height for image-only navbar-logo ([#1466](https://github.com/bloom-housing/bloom/issues/1466))) (Andrea Egan)
  - Remove border from navbar wrapper and align border color on primary button ([#1596](https://github.com/bloom-housing/bloom/pull/1596)) (Marcin Jedras)

- Added:
  - Preview (disabled) state for Listings Application button ([#1502](https://github.com/bloom-housing/bloom/pull/1502)) (Jared White)
  - Automated a11y testing for ui-components ([#1450](https://github.com/bloom-housing/bloom/pull/1450))
  - Add ActionBlock component ([#1404](https://github.com/bloom-housing/bloom/pull/1459)) (Marcin Jedras)

## 1.0.4 / 2021-07-07

### General

- Added:

  - Added backend/proxy ([#1380](https://github.com/bloom-housing/bloom/pull/1380))
  - Added cache manager to lisitngs controller, added add listing button and cleanup ([#1422](https://github.com/bloom-housing/bloom/pull/1422))
  - Added unit_accessibility_priority_types, unit_rent_types, unit_types table and corresponding API endpoints (also created a relation between Unit and mentioned tables) ([#1439](https://github.com/bloom-housing/bloom/pull/1439)

### Backend

- Fixed:

  - Poor TypeORM performance in `/applications` endpoint ([#1131](https://github.com/bloom-housing/bloom/issues/1131)) (Michał Plebański)
  - POST `/users` endpoint response from StatusDTO to UserBasicDto (Michał Plebański)
  - Replaces `toPrecision` function on `units-transformations` to `toFixed` ([#1304](https://github.com/bloom-housing/bloom/pull/1304)) (Marcin Jędras)
  - "totalFlagged" computation and a race condition on Application insertion ([#1366](https://github.com/bloom-housing/bloom/pull/1366))
  - Fix units availability ([#1397](https://github.com/bloom-housing/bloom/issues/1397))

- Added:

  - Added "closed" to ListingStatus enum
  - Added Transform to ListingStatus field to return closed if applicationDueDate is in the past
  - Added "ohaFormat" to CSV exporter (includes OHA and HOPWA preferences) ([#1292](https://github.com/bloom-housing/bloom/pull/1292)) (Michał Plebański)
  - `/assets` endpoints (create and createPresignedUploadMetadata)
  - "noEmailConfirmation" query param to `POST /users` endpoint
  - POST `/users` endpoint response from StatusDTO to UserBasicDto (Michał Plebański)
  - `/jurisdictions` endpoint and DB schema ([#1391](https://github.com/bloom-housing/bloom/pull/1391))
  - `/reservedCommunityTypes` endpoint and DB schema ([#1395](https://github.com/bloom-housing/bloom/pull/1395))
  - list and retrieve methods to `/assets` endpoint
  - `image` field to `listing` model ([#1413](https://github.com/bloom-housing/bloom/pull/1413))
  - reserved_community_type table seeds (`senior` and `specialNeeds`)
  - add applicationDueDate check on submission ([#1409](https://github.com/bloom-housing/bloom/pull/1409))
  - list and retrieve methods to `/assets` endpoint
  - added result_id to Listing model, allow creating `image` and `result` through listing endpoint (cascade)
  - added resultLink, isWaitlistOpen and waitlistOpenSpots to Listing model
  - Added applicationPickUpAddressType and applicationDropOffAddressType columns to Listing model ([#1425](https://github.com/bloom-housing/bloom/pull/1425)) (Michał Plebański)

- Changed:

  - Cleanup seed data generation and add more variety ([#1312](https://github.com/bloom-housing/bloom/pull/1312)) Emily Jablonski
  - Moved Property model to Listing (https://github.com/bloom-housing/bloom/issues/1328)
  - removed eager relation to listing from User model

### Frontend

- Added:

  - Adds filtering capability to listings list and implements on public site ([#1351](https://github.com/bloom-housing/bloom/pull/1359))
  - Listings Management pieces added to Parnter's app, including add and detail pages
    - add accessible at `/listings/add`
    - detail page accessible at `/listings/[id]`
  - New unit summary breaks down units by both type and rent ([#1253](https://github.com/bloom-housing/bloom/pull/1253)) (Emily Jablonski)
  - Custom exclusive preference options ([#1272](https://github.com/bloom-housing/bloom/pull/1272)) (Emily Jablonski)
  - Optionally hide preferences from Listing page ([#1280](https://github.com/bloom-housing/bloom/pull/1280)) (Emily Jablonski)
  - Add ability for site header logo to have custom widths, image only ([#1346](https://github.com/bloom-housing/bloom/pull/1346)) (Emily Jablonski)
  - Created duplicates pages ([#1132](https://github.com/bloom-housing/bloom/pull/1132)) (Dominik Barcikowski)
  - Add Additional Details section to listing management ([#1338](https://github.com/bloom-housing/bloom/pull/1338)) (Emily Jablonski)
  - Add Additional Eligibility section to listing management ([#1374](https://github.com/bloom-housing/bloom/pull/1374)) (Emily Jablonski)
  - Add Leasing Agent section to listing management ([#1349](https://github.com/bloom-housing/bloom/pull/1349)) (Emily Jablonski)
  - Add Additional Fees section to listing management ([#1377](https://github.com/bloom-housing/bloom/pull/1377)) (Emily Jablonski)
  - Add Building Details and Intro section to listing management ([#1420](https://github.com/bloom-housing/bloom/pull/1420)) (Emily Jablonski)
  - Add Building Features section to listing management ([#1412](https://github.com/bloom-housing/bloom/pull/1412)) (Emily Jablonski)
  - Adds units to listings ([#1448](https://github.com/bloom-housing/bloom/pull/1448))
  - Add Rankings and Results section to listing management ([#1433](https://github.com/bloom-housing/bloom/pull/1433)) (Emily Jablonski)
  - Add Application Address section to listing management ([#1425](https://github.com/bloom-housing/bloom/pull/1425)) (Emily Jablonski)
  - Add Application Dates section to listing management ([#1432](https://github.com/bloom-housing/bloom/pull/1432)) (Emily Jablonski)
  - Adds cache revalidation to frontend public app
  - Add FCFS and Lottery section to listing management ([#1485](https://github.com/bloom-housing/bloom/pull/1485)) (Emily Jablonski)

- Fixed:

  - Save application language in the choose-language step ([#1234](https://github.com/bloom-housing/bloom/pull/1234)) (Dominik Barcikowski)
  - Fixed broken Cypress tests on the CircleCI ([#1262](https://github.com/bloom-housing/bloom/pull/1262)) (Dominik Barcikowski)
  - Fix repetition of select text on preferences ([#1270](https://github.com/bloom-housing/bloom/pull/1270)) (Emily Jablonski)
  - Fix aplication submission and broken test ([#1270](https://github.com/bloom-housing/bloom/pull/1282)) (Dominik Barcikowski)
  - Fix broken application search in Partners ([#1301](https://github.com/bloom-housing/bloom/pull/1301)) (Dominik Barcikowski)
  - Fix multiple unit rows in summaries, sorting issues ([#1306](https://github.com/bloom-housing/bloom/pull/1306)) (Emily Jablonski)
  - Fix partners application submission ([#1340](https://github.com/bloom-housing/bloom/pull/1340)) (Dominik Barcikowski)
  - Hide Additional Eligibility header if no sections present ([#1457](https://github.com/bloom-housing/bloom/pull/1457)) (Emily Jablonski)
  - Listings Management MVP visual QA round ([#1463](https://github.com/bloom-housing/bloom/pull/1463)) (Emily Jablonski)

- Changed:

  - Allow preferences to have optional descriptions and an optional generic decline ([#1267](https://github.com/bloom-housing/bloom/pull/1267)) Emily Jablonski
  - Refactored currency field logic to be generic & reusable ([#1356](https://github.com/bloom-housing/bloom/pull/1356)) Emily Jablonski

### UI Components

- Added:

  - Dropzone-style file upload component ([#1437](https://github.com/bloom-housing/bloom/pull/1437)) (Jared White)
  - Table image thumbnails component along with minimal left/right flush table styles ([#1339](https://github.com/bloom-housing/bloom/pull/1339)) (Jared White)
  - Tabs component based on React Tabs ([#1305](https://github.com/bloom-housing/bloom/pull/1305)) (Jared White)
    - **Note**: the previous `Tab` child of `TabNav` has been renamed to `TabNavItem`
  - Icon support for standard variants of Button component ([#1268](https://github.com/bloom-housing/bloom/pull/1268)) (Jared White)
  - Generic date component ([#1392](https://github.com/bloom-housing/bloom/pull/1392)) (Emily Jablonski)

- Fixed:

  - Correct LinkButton and other styles in Storybook ([#1309](https://github.com/bloom-housing/bloom/pull/1309)) (Jared White & Jesse James Arnold)
  - Fix aria reserved for future use warning ([#1378](https://github.com/bloom-housing/bloom/issues/1378)) (Andrea Egan)

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
