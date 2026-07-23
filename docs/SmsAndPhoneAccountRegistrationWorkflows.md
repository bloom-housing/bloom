# SMS & Phone Account Registration — Workflow Breakdown

**Companion to:** [SmsAndPhoneAccountRegistration.md](./SmsAndPhoneAccountRegistration.md) (the technical design). That document is organized by technical layer (schema, then auth, then SmsService, then frontend...), which is right for implementation but scatters any single user journey across a dozen sections. This document reorganizes the same design around the distinct end-to-end workflows it introduces, so each can be scoped, estimated, and reviewed on its own. Section references like "§4.1" throughout point back to the main TDD, which remains the source of truth for exact schema, DTOs, and endpoints.

## The shared hub: a verified login phone number

Every workflow below either **produces** a verified `login_phone_number` on an account or **consumes** one that already exists. That single piece of state is why these workflows interlock:

| Capability | Consumes a verified login phone | Produced by |
| --- | --- | --- |
| SMS listing-alert opt-in (Workflow 2) — the only SMS content a dual-identifier account can ever receive | Yes — can't opt in without one | Workflow 1 or Workflow 2's own first step |
| Phone OTP sign-in (Workflow 3) | Yes | Workflow 1 or Workflow 2 |
| Phone password sign-in (Workflow 3) | Yes | Workflow 1 or Workflow 2 |
| SMS password reset (§4.5) | Yes | Workflow 1 or Workflow 2 |
| Email-based flows (email OTP, email password reset, change-email) | No — needs `email` instead | Original email registration, or Workflow 4 (add email to a phone-only account) |

Keep this table in mind while reading each workflow: Workflow 1 is the *only* one that can produce a verified phone with **no email present at all**, which is why it carries almost all of the design's complexity and risk.

## Workflow 1 — Create an account with a phone number as the only identifier

*(User's item 3 — "the most complicated piece.")* This is the genuinely new capability: an account that never has an email address at any point in its life, unless someone later runs Workflow 4 on it.

### User journey

1. Applicant chooses "Cell phone number" instead of "Email" on create-account (radio toggle, flag-gated, §9).
2. Enters phone (US, validated to E.164 via the existing `PhoneField`), password, first/last name (§4.1).
3. Backend creates the account with `loginPhoneNumber` set, `email` **null**, and no `confirmationToken` — that machinery is email-only (§4.1, §3.1).
4. A 6-digit code is texted to the number (§3.2, §5.1–5.2).
5. Applicant enters the code on the existing `/verify` page — the same UI already used for passwordless email login, reused rather than rebuilt (§4.2).
6. **The first successful code entry does three things at once**: logs the applicant in, sets `loginPhoneNumberVerified = true`, and sets `confirmedAt` — registration verification and first login are the same event (§4.2).
7. A consent interstitial appears next (`source: postRegistration`, §6) — but only for the one thing this account type can actually opt into: new listing alerts. Application confirmation, status updates, and lottery results don't need this screen at all; they're already flowing automatically the moment step 6 verified the phone (§2's phone-only-transactional classification). The applicant can agree to listing alerts or skip.
8. Applicant lands on the dashboard with **no prior applications attached** — Workflow 1 accounts never get the automatic linking that email accounts get (decision 5).

### Why this is the complex one — ripple effects

Because there is no email, on-paper (no pun intended) invisible dependencies on `user.email` throughout the codebase become active bugs unless explicitly handled. The full inventory is in the main TDD's §8; the ones with real product consequences, not just defensive code:

- **Confirmation/status/lottery texts are automatic here, no opt-in needed** — this is the one place in the whole design where that's true without qualification. Email accounts get application-confirmation and status-update emails unconditionally; a Workflow 1 account gets the SMS equivalent unconditionally too, the moment its phone is verified (§2's phone-only-transactional classification), because SMS is its *only* channel. The only thing step 7's interstitial actually gates for this account type is listing alerts.
- **No account-recovery fallback.** Password reset is SMS-only for these accounts (§4.5) — there is no "no, use my email instead" escape hatch, because there is no email. If the applicant loses access to that phone number (lost phone, changed carrier, recycled by someone else), there is no self-service recovery path in this design. Worth a support/ops conversation with LAHD before launch — dual-identifier accounts (Workflow 2/4) don't have this exposure.
- **STOP is closer to a full lockout for this account type.** Per risk R2, carriers block *all* traffic — including login OTPs — to a number that's texted STOP, regardless of the PRD's "transactional continues" framing. For a dual-identifier account this is an inconvenience (they still have email/password). For a Workflow 1 account it can mean losing access to login codes and password-reset codes with only a blind "text START" as recourse. This risk lands almost entirely on this workflow.
- **Duplicate detection loses its strongest signal.** AFS matches on email + name/DOB today; a Workflow 1 account leaves no email key, so §11's new phone-matching key exists specifically to keep duplicate detection working for this population.
- **No linking of prior history.** Unlike email accounts (which auto-attach past applications submitted under the same address), a returning applicant who previously applied on paper or with an email-based account gets no automatic reunification if they now create a Workflow 1 account — a deliberate privacy tradeoff (decision 5), not an oversight, but a real UX cost for that applicant.
- **Deletion without notice was a real gap.** The inactivity-warning cron only emailed people; Workflow 1 accounts needed an SMS variant added specifically so they aren't silently deleted (§8).
- **A duplicate-registration race that can't happen on the email side.** Email uniqueness is enforced unconditionally at the DB level. Phone uniqueness is only enforced among *verified* numbers (§3.1), so two people can start registering the same number before either verifies — the race is settled at verification time by a unique-index conflict (§4.2). This is a structurally new failure mode that doesn't exist for email registration.

### Technical pieces touched

§3.1 (schema), §3.2 (verification codes table), §4.1–§4.2 (registration/verification), §4.5 (password reset), §6 (consent interstitial variant), §8 (full fallout inventory), §11 (AFS), Appendix B rows: verification code, login code, password reset code, account removal warning.

## Workflow 2 — Add a phone number to an existing email account and opt into SMS notifications

*(User's item 1.)* Unlike Workflow 1, this account never loses its email — it gains a second, parallel identifier.

### User journey

1. Signed-in applicant (originally registered with email) goes to Account Settings.
2. Enters a cell phone number → `POST /user/request-phone-change` → code texted to that number (§4.6).
3. Enters the code → `PUT /user/confirm-phone-change` → `loginPhoneNumber` set and verified. The account now has **both** identifiers, which unlocks phone-based login (Workflow 3: OTP or password, either channel) and SMS password reset. **It does not turn on any SMS content notifications** — application confirmation, status updates, and lottery results stay on email only for this account, because email already covers that content (§2's classification: those three are restricted to accounts with *no* email). This is a deliberate design boundary, not an oversight: a dual-identifier account gets phone-based sign-in convenience from this step, nothing more.
4. Applicant goes to Notification Preferences, reads the full TCPA consent language, checks the opt-in box → `PUT /user/sms-consent` (`source: accountSettings`) flips `sendSmsNotifications` and writes an `SmsConsentRecord` (§6). This is the *only* SMS content this account type can ever receive — new listing alerts — and it's the only thing this step controls.
5. From here on, this account's email notifications are completely unchanged (application confirmation, status updates, lottery results — all still email, exactly as before step 2 ever happened). The only new thing SMS adds, if step 4's opt-in was completed, is listing alerts arriving over both channels.
6. If they later text STOP, our own suppression logic blocks the listing-alert channel (`SmsOptOut`, phone-keyed, §5.3) — the only SMS channel this account type has to begin with. Per risk R2, carriers typically block *all* SMS traffic to a STOPped number at their layer, so this account also loses phone-based login/reset convenience until they text START — but unlike Workflow 1, they never lose access to their actual application information, since that was never on SMS for this account type in the first place. Email keeps working throughout.

### Design note worth flagging explicitly

**Whether this phone becomes a login credential depends on the jurisdiction's flags, not just on verifying it (§2).** `enableSmsAccounts` and `enableSmsNotifications` are independent: the login strategies (§4.3) check `enableSmsAccounts` specifically, separately from whatever flag let the phone get verified in the first place (§4.6 runs under `enableSmsNotifications`). So a jurisdiction *can* offer a genuinely notification-only phone number, by running `enableSmsNotifications` without `enableSmsAccounts` — an email account in that jurisdiction could add and verify a phone purely to receive listing alerts, and phone+password/phone+OTP sign-in (Workflow 3) would still be refused for that number. **For LAHD specifically, both flags are on at launch**, so in practice steps 2–3 here do grant a login credential alongside notification eligibility — worth being explicit with LAHD that this is a *configuration choice*, not an unavoidable side effect of adding a phone number, in case they'd rather launch with `enableSmsAccounts` scoped to phone-only registration only and keep Workflow 2's added phones notification-only.

Two smaller notes:

- `request-phone-change` rejects a number already verified on another account (§4.6), so a Workflow 2 applicant can't claim a Workflow 1 applicant's number or vice versa.
- Re-consent when this phone number is later changed (via Workflow 4) is an open legal question (Q1) — the current design carries the opt-in forward.

### Technical pieces touched

§2 (flag independence — this workflow runs under `enableSmsNotifications` alone), §4.6 (request/confirm-phone-change), §6 (consent capture, settings variant, re-enrollment after STOP), §7.3 only (listing alerts — §7.1/§7.2/§7.4 don't apply to this workflow's accounts at all, per §2's classification), §3.3 (`SmsConsentRecord`, `SmsOptOut`), Appendix B rows: the two listing-alert message types.

## Workflow 3 — Sign in with a one-time code, sent to email or phone

*(User's item 2.)* This is purely about the login mechanism — it doesn't create or change identifiers, it consumes whichever ones already exist on the account.

### User journey

- **Email OTP (existing, unchanged):** sign-in → "Send me a login code" → `requestSingleUseCode(email)` → `/verify?email=…&flowType=login` → `loginViaSingleUseCode(email, code)`. Nothing in this design changes this path.
- **Phone OTP (new):** same shape, but only functions for an account that already has a verified `loginPhoneNumber` — produced by either Workflow 1 or Workflow 2. Sign-in → enter a phone number (the UI classifies it client-side vs. an email address) → `requestSingleUseCode(phoneNumber)` → code checked against the new `sms_verification_codes` table rather than the on-row `singleUseCode` column used by email → `/verify?phoneNumber=…&flowType=login` → `loginViaSingleUseCode(phoneNumber, code)` (§4.3, §4.4).

**This workflow has no independent "on" state** — the phone branch is inert on any account that hasn't run Workflow 1 or Workflow 2 first. It's listed as its own workflow because the *mechanism* (union DTOs, strategy changes) is a single piece of work shared by both producer workflows, not because it stands alone.

### A closely related, smaller change shipped alongside it

The password-login strategy (`mfa.strategy.ts`) gets the identical union-DTO treatment (§4.3) so that phone+password sign-in works too, for the same reason a Workflow-1 registrant sets a password at account creation. It's not a one-time code, but it's the same file and the same design pattern, so it ships as part of this same body of work rather than as a separate workflow.

### Worth surfacing

The PRD's 3-requests-per-30-minutes rate limit (§3.2) applies only to the new phone-code path. The existing email OTP request has **no rate limit today** — this design doesn't change that, but it's an inconsistency between the two channels worth a conscious decision (extend the limit to email too, or accept the asymmetry) rather than an accident to discover later.

### Technical pieces touched

§4.3 (both strategies), §4.4 (`request-single-use-code` phone branch), §3.2 (verification codes table, rate limiting), Appendix B: login code.

## Workflow 4 — Managing identifiers after the fact (additional workflow)

Not one of the three named workflows, but every account eventually touches this surface, and it's where a few of the sharper edge cases live — worth calling out on its own rather than burying it inside Workflow 2.

- **Add email to a phone-only account** — the mirror image of Workflow 2, closing the loop for a Workflow 1 applicant who later wants email. This is the *cheapest* piece in the whole design: it reuses the existing change-email + confirmation-link flow completely unmodified (§4.6, first bullet). No new endpoint.
- **Change an already-verified phone number** — runs the same request/confirm-phone-change endpoints as Workflow 2's first step, but starting from a verified state. The old number and the new number occupy the same `loginPhoneNumber` column, so the swap is atomic on `confirm-phone-change` — there's no window where the account has zero verified identifiers (verified by re-reading §4.6's update path).
- **Remove an identifier** — blocked server-side, and by a DB CHECK as backstop, if it would leave the account with neither email nor a verified phone (§4.6, third bullet). This is what actually enforces "every account keeps at least one identifier" (decision 2) at the moment of *removal*, as opposed to registration time.
- **Open question living here:** does changing the phone number require re-collecting SMS consent for the new number (Q1)? The design as written carries the existing `sendSmsNotifications` state forward and logs a `phoneChanged` consent event rather than resetting to opted-out — flagged for legal confirmation, not yet decided.

### Technical pieces touched

§4.6 in full, §6 (Q1), Appendix B: none new (reuses existing message types).

## Resolution: single combined release, built in workflow order

The gap identified above — a phone-only applicant registering before notification support exists would get zero application-confirmation of any kind — was significant enough that the team decided against a staged rollout. **LAHD ships all four workflows together**, so no applicant is ever in that gap.

That doesn't mean the workflows are built in parallel or in the order listed above, though. The dependency table at the top of this document (which workflow *produces* a verified login phone vs. which *consumes* one) determines a specific build order, spelled out in full in the main TDD's §13:

| Build order | Workflow | Why this position |
| --- | --- | --- |
| 1st | 2. Add phone + opt into notifications | Lowest-risk context (already-authenticated user, no registration races) — proves out both the transactional send/log loop and the full consent/suppress loop (for the listing-alert type) first. Also builds most of Workflow 4 (change-phone, remove-identifier) for free, since they share these endpoints. |
| 2nd | 3. Sign in via phone (OTP or password) | Needs Workflow 2's verified phones to sign into. Building it here — before Workflow 1 — matters because Workflow 1's own verification step reuses this exact login mechanism rather than a second implementation. |
| 3rd | 1. Phone-only account creation | Carries the most edge cases (the §8 fallout inventory alone is a dozen call sites) and its two "reuse" points — login-as-verification, consent capture — depend on Workflows 2 and 3 already existing. The remaining sliver of Workflow 4 ("add email to a phone-only account") slots in immediately after, needing no new code. |

So: **2, then 3, then 1**, with Workflow 4 threaded through — most of it lands alongside Workflow 2, the last piece lands right after Workflow 1 — and nothing reaches applicants until all of it ships as one release.

## Everything not covered above

Feature flags (§2), the `SmsService` provider redesign and webhook infrastructure (§5), the full schema (§3), testing strategy (§12), the build order in full (§13), and the complete risk/open-question list (§14) are shared infrastructure that underpins all four workflows rather than belonging to one — see the main TDD directly for those. Appendix A there also maps every PRD requirement to a design section if you need the reverse lookup.
