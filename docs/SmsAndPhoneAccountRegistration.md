# Technical Design: SMS & Phone Account Registration

**Status:** Draft
**PRD:** SMS & Phone Account Registration (LAHD Housing Registry, June — pending client approval)
**Last updated:** 2026-07-21

## 1. Overview

The LAHD Housing Registry currently requires applicants to create accounts with an email address. This feature removes that barrier by allowing applicants to register and sign in with a US cell phone number, and adds SMS delivery for login codes, application confirmations, application status updates, and lottery results (sent automatically to any verified phone, mirroring how these are already delivered by email today), plus — with explicit TCPA-compliant opt-in — new listing alerts, including STOP/HELP keyword handling and per-message delivery logging given the data retention non-functional requirements in the PRD.

The feature is built in core Bloom behind jurisdiction feature flags so that LAHD can enable it without affecting other jurisdictions.

### Design decisions (settled)

| # | Decision |
| --- | --- |
| 1 | Core Bloom, gated by two new jurisdiction feature flags (`enableSmsAccounts`, `enableSmsNotifications`). |
| 2 | Flexible identity: an account needs at least one **verified** identifier (email or phone). Users can add the other later and log in with either. Phone accounts support both password and OTP login at launch. |
| 3 | `user_accounts.email` becomes nullable. Login phone lives in a **new** E.164 (phone format) column (`login_phone_number`), not the existing free-text `phone_number` contact/MFA field (see 3.1 for reasoning around why a new column instead of reusing phoneNumber field). |
| 4 | Password recovery for phone-only accounts uses an SMS reset-code flow. |
| 5 | **No** phone-based linking of prior applications. `connectUserWithExistingApplications` stays email-only; phone numbers on paper applications are unverified and cell numbers get recycled, so matching by phone risks attaching a stranger's application beyond what happens for email (PII exposure). |
| 6 | Duplicate detection (Application Flagged Sets) gains applicant phone number as a matching key. |
| 7 | SMS sends go through the existing `SmsService` provider abstraction (Twilio or AWS via `SMS_PROVIDER`). AWS send capability is being delivered by parallel infra work; §5.4 lists what this feature additionally requires from that work. |

### Out of scope

- Partner/admin users: registration, MFA, and partner phone fields are untouched.
- Applicant contact fields on applications (`applicant.emailAddress`, `applicant.phoneNumber`, `noEmail`/`noPhone`, contact preferences) keep their current behavior; account identity is separate from application contact data.
- International phone numbers (US-only per PRD, validated E.164).
- A message-queueing system (see throughput note in §7.3).

## 2. Feature flags

Two flags, added to `FeatureFlagEnum` and `featureFlagMap` in `api/src/enums/feature-flags/feature-flags-enum.ts` and seeded on Angelopolis (the LA staging jurisdiction, `api/prisma/seed-staging/seed-angelopolis.ts`).

- **`enableSmsAccounts`** — the capabilities that let a phone number **be an account's login identity**: phone-only registration (§4.1), phone-based login via OTP or password (§4.3), SMS password reset (§4.5), and the AFS phone-matching key (§11), which exists specifically to compensate for phone-only applicants lacking an email dedup signal.
- **`enableSmsNotifications`** — the capabilities that let a phone number **receive SMS**, independent of whether it can log anyone in: verifying a phone on any account for notification purposes (§4.6), the consent capture UI, promotional listing-alert sends, STOP/HELP state sync, and the SMS Terms & Conditions page.

These two flags are **independent, not layered** — a jurisdiction can turn on either without the other:

- **`enableSmsAccounts` only:** applicants can create phone-only accounts and log in via phone, but nobody can opt into SMS listing alerts — the notification/consent machinery is off.
- **`enableSmsNotifications` only:** an email account can add and verify a phone number (§4.6) purely to receive SMS — listing alerts if they opt in — but **that verified phone cannot be used to log in**, because the login strategies (§4.3) check `enableSmsAccounts` specifically, not just "is this phone verified." This is the first time this design can offer a genuinely notification-only phone number; earlier drafts treated verifying a phone as unavoidably also granting login, because the two capabilities weren't decoupled yet.
- **Both on** (LAHD's launch configuration): phone-only accounts, phone login, adding a phone to an email account, and SMS notifications all work together.

A *future* jurisdiction could reasonably want phone login without adopting listing-alert notifications, or vice versa — email accounts that just want text alerts without the jurisdiction opening up phone-based registration at all. Gating follows the existing pattern: `doJurisdictionHaveFeatureFlagSet` (API) and `isFeatureFlagOn` (frontend), mirroring `enableCustomListingNotifications`.

**Message classification: three categories, not two.**

1. **Account-access codes** — verification code, OTP login code, password reset code (plus the existing partner MFA code, unaffected by any of this). Sent to any verified phone whenever the user explicitly requests one, regardless of whether the account also has email. These aren't "notifications" in the PRD's sense — they're a login mechanism the user triggers in the moment by choosing to use their phone.
2. **Phone-only content notifications** — application confirmation, application status update, lottery results, and the account-removal warning. Sent automatically, no opt-in required, but **only to accounts that have no email** (`email IS NULL`). An account that has both email and phone already receives these over email (unconditionally, as today) — SMS doesn't duplicate them. The moment a phone-only account adds an email (§4.6), it stops receiving these via SMS and starts receiving them via email instead, matching whatever an email-registered account has always gotten.
3. **Promotional** — new listing alerts (open + coming-soon). The one type gated by `sendSmsNotifications`/consent, available to *any* account with a verified phone, dual-identifier or phone-only, since opting into alerts is an active choice regardless of what other contact method exists.

This still deviates from the PRD's literal §4.5 table, which marks application confirmation and status update as requiring opt-in with no phone-only/dual distinction — but the deviation is narrower than an earlier draft of this design, which sent category 2 to *any* verified phone. Restricting category 2 to phone-only accounts means SMS is only ever used for account-servicing content when it's the applicant's *only* channel — arguably a cleaner transactional argument under TCPA/carrier norms than sending it redundantly alongside an existing email relationship would have been. Still needs explicit LAHD/legal sign-off before launch (see open question Q3).

## 3. Data model & migrations

### 3.1 `user_accounts` changes

```prisma
// schema.prisma — UserAccounts
email                    String?  @unique() @db.VarChar          // was: String (NOT NULL)
loginPhoneNumber         String?  @map("login_phone_number") @db.VarChar(16)  // E.164, US-only
loginPhoneNumberVerified Boolean  @default(false) @map("login_phone_number_verified")
```

```sql
ALTER TABLE user_accounts ALTER COLUMN email DROP NOT NULL;
ALTER TABLE user_accounts ADD COLUMN login_phone_number varchar(16);
ALTER TABLE user_accounts ADD COLUMN login_phone_number_verified boolean NOT NULL DEFAULT false;

CREATE INDEX user_accounts_login_phone_number_idx ON user_accounts (login_phone_number);

-- Uniqueness only among VERIFIED login phones. Prisma cannot express partial indexes;
-- raw SQL follows the precedent of migration 17 (duplicates view).
CREATE UNIQUE INDEX user_accounts_login_phone_number_verified_key
  ON user_accounts (login_phone_number) WHERE login_phone_number_verified = true;

-- Every account keeps at least one identifier (an unverified login phone counts:
-- it is the sole identifier during the window between registration and code entry).
ALTER TABLE user_accounts ADD CONSTRAINT user_accounts_identifier_check
  CHECK (email IS NOT NULL OR login_phone_number IS NOT NULL);
```

**Why a new column instead of reusing `phoneNumber`:** that column has no uniqueness constraint today, and never has — any number of accounts could already share a value — and it stores whatever format was submitted rather than a canonical one (E.164 vs. `(310) 555-1234` vs. `310.555.1234` can all represent the same number across different rows). Public applicants have no existing access to it at all: `EditPublicAccount.tsx` doesn't render it, and `omitPhoneIfPublic` strips it from every public-user update request, so it's populated only by partner accounts (via SMS MFA setup) and advocates (via their account-edit page). That scopes the *impact* of reuse, but not the decision — `user_accounts` is one table shared across every role, so any constraint or semantic we add to this column applies to every existing row, not just public ones:

- **Uniqueness would need to hold across data we haven't audited.** Partner MFA never required this column to be unique. Adding a partial unique index now has to succeed against whatever partner/advocate data already exists — not public users', who have none — and could fail to build, or start rejecting partner logins, if any legacy duplicates are present.
- **"Verified" would mean two different things on the same column.** For an existing partner row, `phoneNumberVerified = true` means "completed SMS MFA once." Reusing it for public accounts would make the same flag also mean "this is my verified login identity" — the thing the at-least-one-identifier CHECK and SMS-notification eligibility both key off. Any future code reading that flag generically would need to know which role it's looking at to interpret it correctly.
- **Format would become inconsistent within the same column.** Partner/advocate writes are loosely validated, not canonicalized. If public registration started writing strict E.164 into the same column, its format would depend on which code path last touched a given row.

A dedicated `login_phone_number` column sidesteps all three: it starts empty, canonicalized to E.164 from day one, with a partial unique index scoped to the rows that actually use it — and leaves partner MFA machinery, and its existing unaudited data, completely untouched. A public user's application contact phone (`Applicant.phoneNumber`, a separate table entirely) may also legitimately differ from their login identifier regardless.

**Nullable unique email:** Postgres treats NULLs as distinct in unique indexes, so any number of null-email accounts coexist under the existing index.

**Snapshots:** `UserAccountSnapshot.email` becomes nullable and gains the two new columns; `snapshot-create.service.ts` copies columns explicitly and must be updated.

### 3.2 `sms_verification_codes`

```prisma
model SmsVerificationCode {
  id          String             @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  createdAt   DateTime           @default(now()) @map("created_at") @db.Timestamp(6)
  userId      String             @map("user_id") @db.Uuid
  user        UserAccounts       @relation(fields: [userId], references: [id], onDelete: Cascade)
  codeHash    String             @map("code_hash") @db.VarChar      // sha256 of the 6-digit code
  purpose     SmsCodePurposeEnum                                    // login | passwordReset | phoneChange
  phoneNumber String             @map("phone_number") @db.VarChar(16) // E.164 destination (candidate number for phoneChange)
  expiresAt   DateTime           @map("expires_at") @db.Timestamptz(6)
  usedAt      DateTime?          @map("used_at") @db.Timestamptz(6)
  attempts    Int                @default(0)

  @@index([userId, purpose])
  @@index([phoneNumber, createdAt]) // rate-limit window query
  @@map("sms_verification_codes")
}
```

**Why not reuse the on-row `singleUseCode` columns:** they are shared with partner MFA and pwdless email login (one column conflates purposes — a password-reset code would be replayable as a login code), they cannot represent a *candidate* phone number during phone-change verification, and they provide no substrate for the PRD's rate limit. The on-row columns are left alone for email/MFA flows.

Details:

- **Three purposes.** `login` covers both registration verification and OTP login — "prove ownership of this phone, get logged in"; the first success also sets verified + confirmed (§4.2). `passwordReset` and `phoneChange` are self-describing. No separate "phoneVerification" purpose is needed.
- **Codes are stored hashed** (sha256). `attempts` increments on wrong submissions; the row is invalidated after 5.
- **Generation** reuses `generateNewCode` extracted from `api/src/utilities/get-single-use-code.ts`. Resend-within-TTL returns the newest unexpired unused row for (user, purpose) rather than inserting, mirroring `getSingleUseCode` semantics.
- **Rate limit (PRD: max 3 requests per 30 minutes):** `COUNT(*) WHERE phone_number = $1 AND created_at > now() - interval '30 minutes'` before insert; at the limit throw 429 (`smsRequestLimit`). A DB count is correct across multiple API instances where in-memory throttling is not. Keyed by **phone number** rather than user so it also throttles abuse aimed at a victim's number.
- **New envs:** `SMS_CODE_LENGTH=6`, `SMS_CODE_TTL=600000` (10 min), `SMS_CODE_MAX_REQUESTS=3`, `SMS_CODE_REQUEST_WINDOW_MS=1800000`. Deliberately **not** reusing `MFA_CODE_LENGTH`/`MFA_CODE_VALID` — that would silently change partner MFA behavior to meet the PRD's 6-digit/10-minute spec.
- **Cleanup:** stale rows (`expires_at` older than a day) are deleted opportunistically on insert; no new cron needed.

### 3.3 Consent, opt-out, and message log tables

```prisma
model SmsConsentRecord { // APPEND-ONLY audit of every consent transition
  id                 String                @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  createdAt          DateTime              @default(now()) @map("created_at")
  userId             String?               @map("user_id") @db.Uuid   // null only for keyword events from unknown numbers
  phoneNumber        String                @map("phone_number") @db.VarChar(16)
  action             SmsConsentActionEnum  // optIn | optOut | stopKeyword | startKeyword | phoneChanged
  source             SmsConsentSourceEnum  // postRegistration | accountSettings | smsKeyword
  consentTextVersion String                @map("consent_text_version") // e.g. "2026-07-15"
  consentText        String?               @map("consent_text") @db.Text // rendered snapshot, user's language
  language           LanguagesEnum?

  @@index([userId])
  @@index([phoneNumber])
  @@map("sms_consent_records")
}

model SmsOptOut { // phone-keyed hard suppression (STOP)
  phoneNumber String    @id @map("phone_number") @db.VarChar(16)
  createdAt   DateTime  @default(now()) @map("created_at")
  reason      String    // 'stopKeyword' | 'manual'
  releasedAt  DateTime? @map("released_at") // set by inbound START; NULL = suppressed

  @@map("sms_opt_outs")
}

model SmsMessageLog {
  id                String                @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  createdAt         DateTime              @default(now()) @map("created_at")
  userId            String?               @map("user_id") @db.Uuid
  phoneNumber       String                @map("phone_number") @db.VarChar(16)
  messageType       SmsMessageTypeEnum    // verificationCode | otpLogin | passwordReset | mfaCode |
                                          // applicationConfirmation | applicationStatusUpdate |
                                          // listingAlert | listingAlertComingSoon |
                                          // lotteryPublished | accountRemovalWarning
  templateKey       String                @map("template_key") // translation key — never the rendered body
  language          LanguagesEnum?
  provider          String                // 'twilio' | 'aws'
  providerMessageId String?               @map("provider_message_id") // Twilio SID / AWS MessageId
  status            SmsDeliveryStatusEnum @default(queued) // queued | sent | delivered | failed | undelivered | suppressed | skippedNoOptIn
  errorCode         String?               @map("error_code")
  statusUpdatedAt   DateTime?             @map("status_updated_at")

  @@index([providerMessageId])
  @@index([userId])
  @@map("sms_message_log")
}
```

- **Consent state** lives on the existing `UserPreferences.sendSmsNotifications` boolean (already in the schema and round-tripping through `GET/PUT /user/preferences`); `SmsConsentRecord` is the auditable history of every transition, satisfying the PRD's data-retention requirement (timestamp + consent text version).
- **Suppression precedence** at send time: `SmsOptOut` (phone-level STOP) beats `sendSmsNotifications` (user opt-in) beats `UserNotificationPreferences` filters (which listing alerts fire).
- The message log stores the **template key**, never the rendered body — no OTP codes or PII bodies at rest.
- `Applicant`/`ApplicantSnapshot` need no schema change; the AFS phone key (§11) is view-SQL only.

## 4. Auth flows

### 4.1 Registration — extend `POST /user/public`

No new endpoint. The DTOs (`api/src/dtos/users/user.dto.ts`, `public-user-create.dto.ts`) gain an email-or-phone union:

- `email`: existing `@IsEmail` + `@EnforceLowerCase`, wrapped in `@ValidateIf((o) => !o.loginPhoneNumber)`.
- `loginPhoneNumber?`: `@ValidateIf((o) => !o.email)` + `@IsPhoneNumber('US')`.
- The service rejects requests carrying **both** (`provideSingleIdentifier`, 400) — registration establishes one verified identifier; the second is added later in settings (§4.6). This keeps the verification flow single-track.

`createPublicUser` (`api/src/services/user.service.ts`) branches when `dto.loginPhoneNumber` is present:

1. Gate on `enableSmsAccounts` for the jurisdiction, else 400.
2. Dedupe: `handleExistingUser` gains a phone branch — `findFirst({ loginPhoneNumber, loginPhoneNumberVerified: true })` → 409 `phoneInUse`. Duplicate **unverified** registrations are allowed (the partial index permits them); the race is settled at verification (§4.2). The email branch must be guarded so it never runs `findUnique({ where: { email: undefined } })` (Prisma throws at runtime).
3. Create the user with `loginPhoneNumber`, no `email`, and **no** `confirmationToken` (that is email-JWT machinery); insert an `SmsVerificationCode` (purpose `login`) and send it via `smsService.sendVerificationCode`.
4. **Skip `connectUserWithExistingApplications`** (decision 5) — the existing call becomes conditional on `newUser.email`.

Stale never-verified accounts age out via the existing inactive-user deletion cron (verify its criteria cover never-confirmed accounts — risk R8).

### 4.2 Phone verification = first OTP login

No new confirm endpoint. `POST /auth/loginViaSingleUseCode` already calls `confirmAndSetCredentials` for unconfirmed users (`auth.service.ts`). The phone path extends it: on first successful code login, set `loginPhoneNumberVerified = true` and `confirmedAt` in one transaction, catching Prisma `P2002` from the partial unique index → 409 `phoneInUse` (the loser of a duplicate-registration race). The registration UX is the existing `/verify` page flow, identical in shape to pwdless email.

### 4.3 Login — single endpoints, union DTOs

passport-local's `authenticate()` rejects with 400 **before** `validate()` runs if the configured `usernameField` is missing from the body, so phone logins cannot pass through strategies configured with `usernameField: 'email'`. Both existing strategies already ignore passport's extracted fields and re-validate `req.body` through a `ValidationPipe` (verified: `single-use-code.strategy.ts:43-51`; `mfa.strategy.ts` same pattern). So the fix is two lines per strategy, with a comment explaining why:

- **`single-use-code.strategy.ts`**: `usernameField: 'singleUseCode', passwordField: 'singleUseCode'` (always present). `LoginViaSingleUseCode` gains optional `phoneNumber` (`@ValidateIf` union with `email`). Phone branch: gate on `enableSmsAccounts` (the email branch keeps `allowSingleUseCodeLogin`); look up by `loginPhoneNumber`; validate against `sms_verification_codes` (purpose `login`, unexpired, unused, hash match, `attempts < 5`) instead of the on-row `singleUseCode`; keep `checkUserLockout` / `failedLoginAttemptsCount` handling identical.
- **`mfa.strategy.ts`** (password login): `usernameField: 'password', passwordField: 'password'`. `Login` gains the same union. Phone branch: gate on `enableSmsAccounts` (same as the OTP branch — a phone verified under `enableSmsNotifications` alone must not be usable here, per §2); `findFirst({ loginPhoneNumber, loginPhoneNumberVerified: true })`, then identical password/lockout logic (public users never have `mfaEnabled`).

Alternative considered and rejected: parallel phone strategies + `POST /auth/login-via-phone*` endpoints — endpoint sprawl, duplicated lockout logic, and two frontend code paths for no isolation benefit.

### 4.4 OTP request — extend `POST /user/request-single-use-code`

`RequestSingleUseCode` gains the union. The phone branch in `requestSingleUseCode`:

- Looks up by `loginPhoneNumber`, verified **or** unverified (unverified is the registration-resend case).
- Runs the rate-limit check **first** — 429 even for known users; this is the PRD's 3-per-30-minute window.
- Returns a neutral `{ success: true }` when the number is unknown (parity with the email branch; prevents account enumeration).
- Gates on `enableSmsAccounts` instead of `allowSingleUseCodeLogin`.

### 4.5 SMS password reset (decision 4)

- `PUT /user/forgot-password`: the `EmailAndAppUrl` DTO gains the union. Phone branch: find by verified `loginPhoneNumber` → rate limit → code row (purpose `passwordReset`) → `smsService.sendPasswordResetCode` → neutral success when unknown.
- New endpoint `POST /auth/verify-reset-code`: `{ phoneNumber, code }` → validate against the code table → mint the **existing** reset JWT (`{ id, exp: 1h }`), store it in `resetToken`, and return it. Everything downstream — `PUT /auth/update-password` and the public reset-password page — is unchanged. Minimal new surface.

### 4.6 Identity changes in settings (flexible identity, decision 2)

- **Add email to a phone-only account:** reuse the existing change-email machinery untouched — `PUT /user/public` with `newEmail` + `appUrl` sends a confirmation email; `PUT /auth/confirm` writes `token.email`. While here, add a `P2002` catch in `confirmUser` → 409 `emailInUse` (today a conflicting confirm would 500).
- **Add/change login phone** (new, verified against the *candidate* number; gated on `enableSmsNotifications` — not `enableSmsAccounts` — so an email account can do this purely to receive SMS, per §2's flag independence):
  - `POST /user/request-phone-change` (authed): `{ loginPhoneNumber }` → reject if verified elsewhere (`phoneInUse`) → rate limit → code row (purpose `phoneChange`, `phoneNumber` = candidate) → SMS to the candidate number.
  - `PUT /user/confirm-phone-change` (authed): `{ code }` → validate → user snapshot → set `loginPhoneNumber` + `loginPhoneNumberVerified = true` (catch `P2002` → `phoneInUse`). Also appends `SmsConsentRecord(action: phoneChanged)` when `sendSmsNotifications` was on (see open question Q1).
- **Remove an identifier:** via `PUT /user/public` with the identifier nulled; the service validates the *other* identifier exists and is verified (`lastIdentifier`, 400); the DB CHECK is the backstop.
- `agreedToTermsOfService` is unchanged — phone registration submits the same field. SMS consent (§6) is entirely separate and never touches it.

## 5. SmsService redesign

`api/src/services/sms.service.ts` currently has one hardcoded-English method (`sendMfaCode`, "Partners Portal" copy), no translation, no logging, and no delivery-status handling. Restructure around one private transport plus typed public senders.

### 5.1 Transport

`private sendRaw(phoneNumber, body, kind: 'TRANSACTIONAL' | 'PROMOTIONAL'): Promise<{ provider, providerMessageId }>`

- Twilio: `client.messages.create({ body, from: TWILIO_PHONE_NUMBER, to, statusCallback: '<API base>/sms/status/twilio' })` → returns `sid`.
- AWS: `SendTextMessageCommand({ ..., MessageType: kind, ConfigurationSetName: AWS_SMS_CONFIGURATION_SET })` → returns `MessageId`.

### 5.2 Translation & templates

Inject `TranslationService` and use `getMergedTranslations(jurisdictionId, language)` + node-polyglot exactly as `email.service.ts` does. New `sms.*` key group in `api/prisma/seed-helpers/translation-factory.ts` — `sms.verificationCode`, `sms.loginCode`, `sms.passwordResetCode`, `sms.mfaCode`, `sms.accountRemovalWarning`, `sms.applicationConfirmation`, `sms.applicationStatusUpdate`, `sms.listingAlert`, `sms.listingAlertComingSoon`, `sms.lotteryPublished`, `sms.footer`, `sms.consentText` — plus a data migration inserting the keys into existing jurisdictions' `Translations` rows (pattern: migration 60). The hardcoded MFA string moves to `sms.mfaCode`. Draft copy for every message type is in Appendix B.

`sms.footer` ("Msg&data rates may apply. Reply STOP to opt out, HELP for help. Terms: {smsTermsUrl}") is appended to every promotional message and to the **first phone-only content notification** sent to a number (detected via prior `SmsMessageLog` rows for that number), satisfying the PRD's "linked from every SMS message footer where character limits permit." **Not** appended to account-access codes (verification, OTP, password reset, partner MFA) — those are short-lived, time-sensitive, and carriers generally don't expect opt-out language on them; adding one would also make no sense before `enableSmsNotifications` (and the T&C page it publishes) is even on for a jurisdiction.

### 5.3 Gatekeeper & logging

Three sender categories, matching §2's classification:

- **Account-access codes** (verification, login/OTP, password reset, partner MFA) — always attempt to send to any verified phone; no opt-in or email check.
- **Phone-only content notifications** (application confirmation, application status update, lottery results, account removal warning) — attempt to send only if the account has a verified phone **and no email**; no opt-in check, but the email-null check is a hard gate, not a suppression check like promotional messages get.
- **Promotional** (new listing alerts, `sms.listingAlert`/`sms.listingAlertComingSoon` only) — run through the full gatekeeper, in order: (1) `SmsOptOut` active? → log `suppressed`, skip; (2) `sendSmsNotifications` false? → log `skippedNoOptIn`, skip; (3) send; (4) insert an `SmsMessageLog` row.

All three categories insert an `SmsMessageLog` row on send attempt. See risk R2: carriers/providers block *all* traffic to a STOPped number regardless of our own classification, so skipping the opt-in check doesn't guarantee delivery for the first two categories either.

Inbound/status webhooks live in a new `api/src/controllers/sms.controller.ts`:

- `POST /sms/status/twilio` — delivery status callback (form-encoded `MessageSid`/`MessageStatus`/`ErrorCode`), authenticated via `twilio.validateRequest` (X-Twilio-Signature); updates the log row by `providerMessageId`.
- `POST /sms/inbound/twilio` — STOP-family keywords upsert `SmsOptOut` + append `SmsConsentRecord(stopKeyword, smsKeyword)` (userId resolved by `loginPhoneNumber` when possible); START sets `releasedAt` + records `startKeyword`; HELP is logged only. **Twilio Advanced Opt-Out is enabled** so the provider auto-suppresses and auto-replies (STOP confirmation, HELP text) — our webhook only syncs DB state, and we never send our own STOP confirmation (avoids double replies).
- `POST /sms/status/aws`, `POST /sms/inbound/aws` — SNS subscription endpoints (handle the `SubscriptionConfirmation` handshake + message envelope).

Routes in this API are public-by-default (guards are per-route) — verify no global guard interferes during implementation.

### 5.4 Requirements on the parallel AWS SMS infra work

This feature needs more than a "send SMS" endpoint. Explicit asks:

1. A ConfigurationSet with an event destination: message delivery events → SNS → HTTPS to `/sms/status/aws`.
2. Two-way SMS enabled on the origination number, inbound messages → SNS → `/sms/inbound/aws`.
3. Keyword handling: AWS-managed STOP/HELP responses configured with our copy; confirm whether the AWS-managed opt-out list is used — if so we need opt-out *events* delivered (or a periodic `DescribeOptedOutNumbers` sync job).
4. 10DLC campaign registration covering the promotional message types (listing alerts especially), plus the approved throughput (MPS) figure for the batch-send design (§7.3).
5. The origination number decision for LAHD (10DLC vs toll-free vs short code).

### 5.5 Rate limiting

Implemented in the request paths (§4.4, §4.5, §4.6) via the code-table window count — not inside `SmsService`.

## 6. Consent & compliance

- **Versioning:** an `SMS_CONSENT_TEXT_VERSION` constant plus the canonical English consent text live in `api/src/enums/sms/sms-consent.ts`; translated variants live in the `Translations` table (`sms.consentText`). The frontend renders its own copy from `shared-helpers/src/locales/general.json`; a comment on both constants says "update together and bump the version" (risk R5).
- **Recording:** new authed endpoint `PUT /user/sms-consent` `{ optIn, source: 'postRegistration' | 'accountSettings' }` flips `UserPreferences.sendSmsNotifications` and appends an `SmsConsentRecord` with the **backend's** version and backend-rendered text in the user's language — the client never supplies the recorded text, so the audit trail is tamper-proof.
- **Opt-in UI:** (a) a post-verification interstitial at `sites/public/src/pages/account/sms-consent.tsx`, routed from `/verify` success when `flowType=create` and the account has a login phone; "Agree" and "Not now" both proceed to the dashboard (PRD 4.3/5). (b) An SMS section on `/account/notifications` (§9). Both display the full PRD consent language with the privacy-policy link opening in a new tab to the mobile-data section.
- **Re-enrollment after STOP:** the settings toggle must **not** silently re-enable a STOPped number — provider-side suppression can only be lifted by the user texting START. `GET /user/preferences` gains `smsSuppressed: boolean`; when true the UI shows "Text START to (number) to resume." The inbound START webhook releases suppression and records consent. `sendSmsNotifications` may remain true underneath; the suppression check wins at send time.
- **Model use:** `sendSmsNotifications` is the TCPA opt-in for the one promotional message type — new listing alerts — and it's available to any account with a verified phone, dual-identifier or phone-only alike. `UserNotificationPreferences` (lottery/waitlist/accessibility/regions) continues to filter *which* listing alerts fire, shared with email. Application confirmation, status updates, lottery results, and the removal warning are unaffected by this flag entirely — they're gated on the account having **no email**, not on consent (§2's classification note); a dual-identifier account never receives them over SMS, opted in or not, because email already covers it.

## 7. Notification wiring

Recipient rule for all message types: **the account's `loginPhoneNumber`**, never `applicant.phoneNumber`. Applicants without accounts receive no SMS (consistent with decision 5). Listing alerts (§7.3) go to any account with a verified phone and consent, dual-identifier or phone-only; application confirmation, status updates, and lottery results (§7.1, §7.2, §7.4) go **only to phone-only accounts** — `loginPhoneNumberVerified = true AND email IS NULL` — since a dual-identifier account already receives that content over email (§2).

### 7.1 Application confirmation

`api/src/services/application.service.ts`, beside the existing `dto.applicant.emailAddress` email guard: when the submitting `userAccounts` relation exists, has a verified `loginPhoneNumber`, **has no email**, and the jurisdiction has `enableSmsAccounts`, call `smsService.sendApplicationConfirmation(user, listing, confirmationCode)`. Phone-only content notification (§2, §5.3) — sent unconditionally to phone-only accounts, no opt-in check, but skipped entirely for a dual-identifier account, since they already get the email version. Language: `user.language ?? application.language ?? 'en'`.

### 7.2 Application status update

Same file, next to `applicationUpdateEmail`; same recipient rule via `application.userAccounts`, and the same phone-only-only, no-opt-in treatment as §7.1.

### 7.3 New listing alerts

Extend `listing.service.sendListingPublishNotification` and the daily `sendApplicationOpenNotificationsCronJob` with a second recipient query: `userAccounts` where `userPreferences.sendSmsNotifications = true AND loginPhoneNumberVerified = true` plus the same `notificationPreferences` filters as email. Prefetch the `SmsOptOut` set once per batch; group by language like the email path; send sequentially with small concurrency. There is no queue infrastructure — throughput is bounded by the approved 10DLC MPS (§5.4); a queue is flagged as future work if opted-in volume demands it. Cron scheduling is unchanged (`CronJobService.startCronJob` + `cronJob.lastRunDate`). This work also implements the dormant `sendSmsNotifications` filter left as a TODO in `listing.service.ts`. This is the only notification type available to *any* verified phone regardless of email — the other three (§7.1, §7.2, §7.4) are restricted to phone-only accounts (§2's classification note).

Both existing variants get an SMS template: `sms.listingAlert` when applications are open, `sms.listingAlertComingSoon` when a listing publishes with a future `scheduledApplicationOpenAt` (mirroring the email `ListingNotificationVariant`).

### 7.4 Lottery results (added beyond the PRD at client request)

`lotteryPublishedApplicant` today emails account holders when lottery results are published: `lottery.service.publishLottery` → `getPublicUserEmailInfo`, which collects **account** emails for the listing's applications, excluding paper submissions and `markedAsDuplicate`, with no opt-in check — so phone-only accounts would silently miss lottery results. Add a parallel `getPublicUserSmsInfo` beside it: accounts holding non-duplicate applications on the listing with `loginPhoneNumberVerified = true` **and `email IS NULL`**, grouped by language, sent via `smsService.sendLotteryPublished`. Phone-only content notification (§2, §5.3) — no `sendSmsNotifications` check, but also no send at all for a dual-identifier account, since they already got the email version from `getPublicUserEmailInfo`. The message deliberately contains no results — it deep-links to sign-in, matching the email's behavior (results require authentication, and SMS is not a private channel).

## 8. Null-email fallout inventory

Every place that assumes `user.email` is non-null, and the required handling:

| Location | Change |
| --- | --- |
| `user.service.handleExistingUser` | Branch on which identifier the DTO carries; never `findUnique({ where: { email: undefined } })` (Prisma runtime error). |
| `user.service.findUserOrError` | Add `loginPhoneNumber` to the lookup options; guard against an all-undefined `where`. |
| `user.service.createConfirmationToken` | Email flows only; never called for phone-only accounts. |
| `email.service.ts` send methods (`welcome`, `changeEmail`, `forgotPassword`, `sendMfaCode`, `sendSingleUseCode`, `sendCSV`, `warnOfAccountRemoval`, `advocate*`) | Defensive `if (!user.email) return` at the top of each; callers also branch. |
| Deletion-warning cron | Phone-only users get `smsService.sendAccountRemovalWarning` (transactional/account-servicing — no opt-in needed) instead of email; still sets `wasWarnedOfDeletion`. Deleting accounts without notice is unacceptable, so this ships alongside registration itself, not as a later addition. |
| `lottery.service.getPublicUserEmailInfo` | Make the exclusion explicit: `email: { not: null }` alongside the existing `not: ''`. Phone-only accounts stay excluded from lottery *emails*; the lottery SMS (§7.4) covers them once notification wiring is built (§13). |
| `user-csv-export.service.ts` | Email cell renders empty; add a `loginPhoneNumber` column. |
| `PUT /user/public` + `User`/`UserUpdate` DTOs | `@IsEmail` wrapped in `@ValidateIf`; responses with null email must serialize through `mapTo`. |
| `resendConfirmation` | Email-keyed; phone accounts use `request-single-use-code` instead — frontend routes accordingly, no API change. |
| `snapshot-create.service.ts` | Copy the new columns; snapshot email nullable. |
| Seeds/factories (`user-factory.ts`) | Add a phone-only user variant seeded for Angelopolis. |
| Partner user views | Blank-safe email rendering (public users are generally role-filtered out of partner lists — verify during implementation). |
| `EditPublicAccount.tsx` | Null-email state renders an "Add email" affordance (§9). |

Unchanged by design: JWT payload (already `{ sub: userId }`), applicant email handling on applications, advocate/partner user creation (email stays required in their DTOs), partner MFA.

## 9. Frontend changes (sites/public + shared-helpers, Seeds-only)

- **`shared-helpers/src/auth/AuthContext.ts`:** widen `login`, `requestSingleUseCode`, `loginViaSingleUseCode`, `forgotPassword`, `createPublicUser` to accept `{ email?, phoneNumber? }`; add `verifyResetCode`, `requestPhoneChange`, `confirmPhoneChange`, `updateSmsConsent`. New error strings (`phoneInUse`, `smsRequestLimit`, `lastIdentifier`, consent copy) in `shared-helpers/src/locales/general.json` + the account error-catch helpers.
- **`pages/create-account.tsx`:** single route with an "Email / Cell phone number" radio toggle (Seeds `FieldGroup`), shown only when `isFeatureFlagOn(jurisdiction, enableSmsAccounts)`. The phone branch uses the existing `PhoneField` (react-phone-number-input yields E.164 for US) and posts `loginPhoneNumber`, then routes to `/verify?phoneNumber=…&flowType=create`. A single route (not separate pages) preserves every existing redirect/deep-link into `/create-account` from the apply flow.
- **`pages/verify.tsx`:** accept `phoneNumber` alongside `email`; phone variants of the messaging; submit calls `loginViaSingleUseCode({ phoneNumber, code })`; resend passes the phone. On create-flow success with a phone account + `enableSmsNotifications` → route to `/account/sms-consent`, else dashboard. Code input gets `autocomplete="one-time-code"` and `inputmode="numeric"`.
- **`pages/sign-in.tsx`:** when the flag is on, `FormSignInPwdless` and `FormSignInDefault` swap the email field for one "Email or cell phone number" field; classify client-side (`@` → email, else normalize to E.164 with libphonenumber-js, already a transitive dependency) and send the matching DTO key. A 429 renders the `smsRequestLimit` alert.
- **Forgot password:** identifier field on `pages/forgot-password.tsx`; the phone path goes to a new `pages/reset-password-code.tsx` (enter SMS code → `POST /auth/verify-reset-code` → push the existing reset-password page with the returned token). The existing reset page is unchanged.
- **`EditPublicAccount.tsx`:** new "Cell phone number (sign-in)" section (display + change via the request/confirm-code inline step) and an "Add email" state when `profile.email == null`. `omitPhoneIfPublic` is untouched — login-phone flows use the dedicated endpoints, not the profile PUT.
- **Notifications settings** (`pages/account/notifications.tsx` / `NotificationPreferences.tsx`): SMS opt-in toggle + full consent language + suppressed-state instruction, gated on `enableSmsNotifications`.
- **SMS Terms & Conditions:** `pages/sms-terms.tsx` following the `privacy.tsx` markdown pattern; contains all carrier-required elements (program description, frequency, rates, STOP, HELP, carrier liability, support contact, privacy link, no-third-party-sharing). Linked from the consent copy and `sms.footer`.
- **Accessibility (WCAG 2.1 AA):** Seeds primitives throughout; `aria-live="polite"` on code-error/resend alerts; visible labels on phone inputs; focus moved to the heading on step transitions; the registration toggle is a real radio group, not a custom control.

## 10. Partner-site impacts (minimal)

- User management list/detail: blank-safe email rendering (public users are generally excluded by role filters — verify).
- Application detail/grid/CSV: unaffected — applicant contact fields are separate from account identity, and export helpers are already blank-safe.
- Partner user creation and MFA: unchanged; email remains required for partner/admin/advocate users.
- AFS UI: a new duplicate-rule label for `phoneNumber` in the partners locale (alongside the `email` / `nameAndDOB` labels).

## 11. AFS phone matching key (decision 6)

A migration replaces the duplicates view (`CREATE OR REPLACE VIEW application_flagged_set_possibilities`, base SQL in migration 17) adding a phone branch, scoped to applications submitted after the feature's cutover date (see the retroactive-reprocessing risk below):

```sql
SELECT right(regexp_replace(a.phone_number, '\D', '', 'g'), 10) as "key",
       app.listing_id, app.id as "application_id", 'phoneNumber' as "type"
FROM applications app, applicant a
WHERE a.id = app.applicant_id
  AND a.phone_number IS NOT NULL
  AND app.deleted_at IS NULL
  AND app.created_at >= '<AFS_PHONE_KEY_CUTOVER_DATE>'
```

Last-10-digits normalization reconciles display-formatted applicant phones ("(310) 555-1234") with E.164. Plus `ALTER TYPE rule_enum ADD VALUE 'phoneNumber'` and the `RuleEnum` update in `schema.prisma`.

In `application-flagged-set.service.ts`: filter out `type = 'phoneNumber'` rows when the listing's jurisdiction lacks `enableSmsAccounts` — not `enableSmsNotifications` (§2's flag independence: this key exists because of phone-only *accounts*, which `enableSmsAccounts` controls, not because of notifications) — the view is global, the flag gate lives in the service query, so other jurisdictions' AFS results stay bit-identical. Rule resolution needs a new branch alongside the existing combination logic (`application-flagged-set.service.ts:604-632`, which today only knows how to merge `email` and `nameAndDOB`) to also merge `phoneNumber`, with priority `email` > `phoneNumber` > `nameAndDOB` when constructing the rule key / `combination` — this is new code to write, not just a configuration change.

### Retroactive reprocessing risk on already-resolved listings

The AFS cron only reprocesses a listing when its applications have changed since the last run (`afsLastRunAt` vs. `lastApplicationUpdateAt`, `application-flagged-set.service.ts:479-503`) — but *any* application create, edit, or delete on a listing resets that gate and triggers a **full recompute of every application on that listing**, not just the changed one. This is existing AFS behavior, not new to this feature, but partner corrections on an otherwise-closed, already-resolved listing are common enough that it isn't a remote edge case.

When that recompute happens, the reconciliation logic (`application-flagged-set.service.ts:640-715`) matches existing flagged sets against newly computed ones by **exact `ruleKey` string**, not by which applications are involved. If the phone key changes what kind of match a pair now has — e.g., a pair previously flagged only on `nameAndDOB` now also shares a phone number and becomes a `combination` — the `ruleKey` shape changes, the old row (even a `resolved` one) is **deleted outright** and a **new `pending`** set is created in its place. Even where the ruleKey doesn't change, a shift in group membership resets `status` to `pending` unconditionally, with no check for "was already resolved." Either path, a partner who already cleared that pairing sees it reappear as unresolved — see risk R9.

**Mitigation (recommended): scope the phone key to applications submitted after a cutover date**, via the `app.created_at >= '<cutover>'` clause above (a single global constant is an acceptable simplification while LAHD is the only jurisdiction using this; revisit with a per-jurisdiction cutover if a second jurisdiction adopts the feature later). This means phone matching only ever applies to genuinely new data, so it can never retroactively disturb a resolved flagged set on a listing that predates the feature. The tradeoff: a duplicate between a pre-cutover paper application and a post-cutover phone-registered application won't be caught by the phone key (name/DOB and email matching still apply as before, unaffected). A more general fix — reconciling by application-set overlap instead of exact `ruleKey`, so resolution status survives a rule-key change — would close this gap for good and for any future rule addition, but it changes reconciliation logic shared by every existing rule and is a larger, riskier change to make right before a compliance-sensitive launch; worth a follow-up hardening pass rather than bundling into this feature.

## 12. Testing strategy

- **API unit** (`api/test/unit/services`, `api/test/unit/passports`): user.service phone-registration branches (dedupe, no application linking, both-identifiers rejection); code-table service (TTL reuse, hash match, attempt lockout, 3/30 rate-limit boundary); both strategies' phone branches (existing strategy specs as templates); the SmsService gatekeeper matrix (suppressed / no opt-in / transactional bypass); webhook signature validation.
- **API integration** (`api/test/integration`, SmsService mocked): register-with-phone → request code → `loginViaSingleUseCode` → confirmed + verified; verified-phone conflict (`phoneInUse`); SMS reset round trip through the unchanged `update-password`; STOP inbound → suppression → promotional skip + log row; AFS phone-rule spec extension.
- **Cypress** (`sites/public/cypress`): phone create-account with intercepted API, identifier sign-in field, phone forgot-password, consent interstitial, settings phone change.
- **Migration safety:** the partial index builds trivially (new column is all-NULL); the CHECK passes (every existing row has email); `ADD VALUE` on the enum is additive; the view replacement is rehearsed against a production-shaped dataset (spot-check formatted-phone normalization); full staging rehearsal before deploy.

## 13. Delivery: build order within a single release

LAHD ships accounts and notifications together — there is no user-facing gap where a phone-only applicant can register but can't yet receive any notification about their application. (An earlier draft of this design staged the work into two releases; the companion [workflow breakdown](./SmsAndPhoneAccountRegistrationWorkflows.md) surfaced why that gap mattered — a phone-only account created before notification support existed has no email either, so it would get zero application-confirmation of any kind in the interim.)

Internally, the work still lands in a specific order — driven by which pieces of the design actually depend on which other pieces existing first, not by a transactional/promotional split:

**0. Shared foundation.** Feature flags (§2); schema for identity (`user_accounts.email` nullable, `login_phone_number` + verified flag + partial index + CHECK, §3.1) and verification codes (`sms_verification_codes`, §3.2); `SmsService` transport + translation plumbing for transactional sends (§5.1–5.2). Nothing user-facing yet.

**1. Add a phone number to an existing account, and opt into SMS notifications.** `request-phone-change`/`confirm-phone-change` (§4.6); the consent/opt-out/message-log schema (§3.3) and `PUT /user/sms-consent` (§6, `accountSettings` source); the SmsService gatekeeper and promotional senders (§5.3); the status and inbound webhooks (§5.3–5.4) — needed here so STOP/HELP and delivery logging work for real from the first opted-in user, not bolted on later; the notification wiring (§7) for the listing-alert type specifically (application confirmation, status updates, and lottery results are phone-only-only per §2, gated on `email IS NULL` rather than consent, so they can ship as soon as Milestone 0's `SmsService` transactional plumbing plus Milestone 3's phone-only accounts exist, independent of this milestone's consent work); the settings-page frontend (§9). This goes first because it's the lowest-risk context — an already-authenticated user, no unconfirmed-account races, no registration dedupe logic — and it proves out the full send → consent → suppress → log loop before anything unauthenticated is layered on top. It also picks up two identity-management pieces essentially for free: changing an already-verified phone reuses these same two endpoints, and the "can't remove your last identifier" check (§4.6) is cheap to add and test in this context.

**2. Sign in via phone (OTP or password).** The union-DTO changes to both passport strategies (§4.3); the phone branch of `request-single-use-code` (§4.4); sign-in frontend (§9). Needs step 1's phone-verification mechanism to have real verified numbers to sign into. Building this *before* phone-only registration matters: registration's own verification step (next) reuses this exact login mechanism rather than requiring a second implementation of it.

**3. Create an account with only a phone number.** Registration and dedupe (§4.1); verification-as-first-login, which extends `confirmAndSetCredentials` and directly reuses step 2's `loginViaSingleUseCode` path instead of a separate confirm endpoint (§4.2); SMS password reset (§4.5); the full null-email fallout inventory (§8); the AFS phone-matching key (§11); the post-verification consent interstitial, which reuses step 1's consent-capture backend behind a new frontend entry point (§6, `postRegistration` source); create-account frontend (§9). This goes last because it carries the most edge cases — the fallout inventory in §8 alone touches a dozen call sites — and because its two "reuse" points, login-as-verification and consent capture, depend on steps 1 and 2 already existing. "Add email to a phone-only account" (§4.6, first bullet) slots in immediately after this step: it needs phone-only accounts to exist to be meaningful, but requires no new code — it's the existing change-email flow, unmodified.

Each step is internally testable and reviewable in isolation before the next, more complex one begins, even though nothing reaches applicants until all three — plus the identity-management pieces threaded through steps 1 and 3 — are done and the release ships as one.

## 14. Risks & open questions

### Risks

- **R1 — Phone format inconsistency.** Applicant/partner phones are display-formatted; login phones are E.164. Contained by the separate column and the view-SQL normalization, but any future cross-referencing needs the same normalization.
- **R2 — STOP blocks transactional messages at the carrier/provider layer.** Twilio errors (21610) on *any* send to a STOPped number, so a STOPped phone-only user cannot receive login OTPs despite the PRD's "transactional continues" framing. The login error path must handle this: log the failed send; the verify page shows "If you previously texted STOP, text START to (number)." Needs client expectation-setting.
- **R3 — Provider keyword duplication.** Twilio Advanced Opt-Out / AWS-managed keywords auto-reply and auto-suppress; we only mirror state via webhooks. If infra chooses self-managed keywords instead, we own the confirmation replies — decide with the infra team (§5.4).
- **R4 — 10DLC registration and throughput.** External lead time measured in weeks; promotional volume (listing alerts to a large opted-in base) is bounded by approved MPS with sequential cron sends.
- **R5 — Consent copy duplication.** Frontend locale copy vs the backend audit constant must stay in sync with a version bump; TCPA consent copy needs translation into ~11 languages and legal review.
- **R6 — Message-log retention.** Proposal: 13-month retention with a cleanup cron (covers a delivery-dispute window); confirm with LAHD counsel against existing data-retention policy.
- **R7 — Enumeration.** `phoneInUse` at registration mirrors today's `emailInUse` exposure; neutral responses everywhere else. Accepted as parity.
- **R8 — Stale unverified phone registrations.** Duplicate unverified rows are settled at verification via the partial-index race; verify the inactive-user deletion cron reaps never-confirmed accounts, else add a cleanup.
- **R9 — Retroactive AFS reprocessing on already-resolved listings.** Any edit to an application on a closed listing can trigger a full AFS recompute against the new phone rule, and the reconciliation logic keys on exact `ruleKey`, so it can reset previously-resolved flagged sets to `pending` or delete-and-recreate them entirely (§11). Mitigated by scoping the phone key to post-cutover applications; if that mitigation is dropped, partners need advance warning that resolved duplicates on old listings may reappear.

### Open questions

- **Q1 — Re-consent on phone change.** Current design carries the opt-in over and logs `phoneChanged`; a conservative TCPA reading may require fresh consent for the new number. Legal to confirm.
- **Q2 — Consent-copy placeholders.** The PRD consent language includes `[support contact]` and `[privacy policy URL]`; the T&C requires a representative max-messages-per-month figure. Values needed from LAHD before launch. Note the max-messages estimate now only needs to account for listing alerts (open + coming-soon), since the other message types moved to transactional (§2, Q3).
- **Q3 — Transactional/promotional classification deviates from the PRD.** This design treats application confirmation, application status update, and lottery results as transactional and opt-in-free, but *only* for phone-only accounts — dual-identifier accounts never receive them over SMS at all, opted in or not, since email already covers that content (§2). This deviates from the PRD §4.5 table, which marks the first two as requiring opt-in with no phone-only/dual distinction. The reasoning is that these already send unconditionally over email today with no preference gating, and restricting the SMS version to accounts with no other channel is a narrower, more defensible transactional argument under TCPA/carrier norms than sending it to everyone with a verified phone would have been — but it's still a compliance call with real regulatory consequences, not a product preference, and needs explicit confirmation from LAHD/legal before implementation. If rejected, these three move under `enableSmsNotifications` and the `sendSmsNotifications` opt-in for phone-only accounts, matching §7.3's treatment of listing alerts.

## Appendix A: PRD requirement coverage

| PRD section | Design section |
| --- | --- |
| 4.1 Phone-based registration | §4.1, §4.2, §9 |
| 4.2 One-time login codes | §4.3, §4.4, §3.2 (rate limit) |
| 4.3 Opt-in workflow & consent language | §6, §9 |
| 4.4 Terms and Conditions | §9 (sms-terms page), §5.2 (footer link) |
| 4.5 Message types & opt-in matrix | §5.3 (gatekeeper), §7 — **reclassified**, see §2's classification note and Q3 |
| 4.6 Opt-out handling (STOP/HELP) | §5.3, §6 (re-enrollment) |
| 5 User flows | §4, §6, §9 |
| 6 Accessibility | §9 (WCAG notes) |
| 6 Compliance / privacy / no third-party sharing | §6, §3.3 (consent audit) |
| 6 Data retention / auditability | §3.3, R6 |
| 6 Delivery reliability (receipts) | §3.3 (message log), §5.3, §5.4 |
| 6 Rate limiting | §3.2, §5.5 |
| 6 Permissions (verified phone only, staff excluded) | §3.1 (verified flag), §1 (out of scope) |

Added beyond the PRD (agreed with the team): SMS password reset (§4.5), account removal warning via SMS (§8), lottery results SMS (§7.4), and the coming-soon listing alert variant (§7.3). **Reclassified from the PRD** (pending confirmation, Q3): application confirmation and application status update move from opt-in to transactional-but-phone-only-exclusive, to match their existing unconditional email behavior without duplicating it for accounts that already have email; only new listing alerts remain opt-in/promotional, available to any verified phone.

## Appendix B: Draft SMS copy (English canonical)

How to read this table:

- Copy is written as it will appear in `translation-factory.ts`, with node-polyglot `%{variable}` placeholders.
- Every message leads with the program name — carriers require sender/program identification in each message.
- Bodies target ≤160 GSM-7 characters. The footer (`sms.footer`, §5.2) is appended to every opt-in message and to the first phone-only content notification sent to a number — not to account-access codes — which typically makes those messages two segments. Listing names vary in length, so segment counts are estimates.
- Status and lottery messages deliberately contain **no outcome or PII** — SMS is not a private channel. They deep-link to sign-in (`%{url}` = `publicUrl/sign-in?redirectUrl=…`, the pattern the email footer already uses for notification settings). Listing alerts link to the listing detail page.
- All copy is draft: it needs LAHD/legal review and translation into the jurisdiction's ~11 languages before launch (risk R5).

| Message type | Key | Kind | Draft copy |
| --- | --- | --- | --- |
| Account verification code | `sms.verificationCode` | Transactional | LAHD Housing Registry: %{code} is your account verification code. It expires in 10 minutes. |
| Login code (OTP) | `sms.loginCode` | Transactional | LAHD Housing Registry: %{code} is your sign-in code. It expires in 10 minutes. Never share this code with anyone. |
| Password reset code | `sms.passwordResetCode` | Transactional | LAHD Housing Registry: %{code} is your password reset code. It expires in 10 minutes. If you didn't request this, ignore this message. |
| Partner MFA code | `sms.mfaCode` | Transactional | Your Partners Portal account access token: %{code} *(existing copy retained verbatim to avoid partner churn; now keyed and translatable)* |
| Account removal warning | `sms.accountRemovalWarning` | Transactional (phone-only) | LAHD Housing Registry: Your account will be deleted in %{days} days due to inactivity. Sign in at %{url} to keep your account. |
| Application confirmation | `sms.applicationConfirmation` | Transactional (phone-only) | LAHD Housing Registry: We received your application for %{listingName}. Your confirmation number is %{confirmationCode}. |
| Application status update | `sms.applicationStatusUpdate` | Transactional (phone-only) | LAHD Housing Registry: There is an update to your application for %{listingName}. Sign in at %{url} to view it. |
| New listing alert (open) | `sms.listingAlert` | Opt-in | LAHD Housing Registry: %{listingName} is now accepting applications. View the listing and apply at %{url}. |
| New listing alert (coming soon) | `sms.listingAlertComingSoon` | Opt-in | LAHD Housing Registry: %{listingName} will begin accepting applications on %{openDate}. Learn more at %{url}. |
| Lottery results | `sms.lotteryPublished` | Transactional (phone-only) | LAHD Housing Registry: Lottery results for %{listingName} are available. Sign in at %{url} to view your status. |
| Footer | `sms.footer` | Appended | Msg&data rates may apply. Reply STOP to opt out, HELP for help. Terms: %{smsTermsUrl} |

Keyword replies are configured **provider-side** (Twilio Advanced Opt-Out / AWS-managed keywords, §5.3), not sent by our code; the PRD-mandated texts to configure there:

- **STOP confirmation:** "You have been unsubscribed from LAHD housing notifications. You will no longer receive messages from this number. Reply HELP for help."
- **HELP reply:** "LAHD Housing Registry: For assistance, contact %{supportContact} or visit %{supportUrl}. Text STOP to unsubscribe."
