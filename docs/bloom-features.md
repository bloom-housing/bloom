# Features within Bloom

## General functionality

### Public Site

- **Listings Browse Page** - Home seekers can view all available properties at a glance, with photos, unit types, and key details surfaced upfront.
- **Listings Search** - Home seekers can filter available listings on the browse page by a range of criteria including availability, home type, bedroom size, rent, parking, region, and voucher acceptance.
- **Listing Details Page** - Displays full property information including unit table (type, rent, minimum income, availability), eligibility tags (e.g., Senior, Veteran), application method, and leasing agent contact. Language is plain and jargon-free throughout.
- **Common Digital Pre-Application** - A short-form digital pre-application (<10 questions) capturing the minimum information needed for eligibility screening. Available in all supported languages; mobile-first design. Paper versions can also be uploaded by partners.
- **User Accounts** - Home seekers can create accounts to store and review their application history, automated lottery results, and the status of listings they’ve applied to. The site can be configured to use email/password, or to give the user the opportunity to log in with a code sent to their email address.
- **Multilingual Support** - Sites support multiple languages per jurisdiction.
- **Applicant Notifications** - Email alerts for home seekers on site updates (e.g., new listings).
- **Jurisdiction-Specific Site Content** - Each site includes customizable informational pages covering how the affordable housing application process works, local housing agencies and resources, and required legal disclaimers and privacy policies. Content is tailored to each jurisdiction.

### Partner Portal

- **Listings Management** - Partners can create, edit, preview, and publish listings. Editable fields include basic info, application details, leasing agent, fees, unit information, eligibility requirements, and housing preferences. All listings information can be exported via a CSV for reporting.
- **Listing Review** - If desired, Administrators can review listings and request changes from property managers on new listings before they are published.
- **Application Management** - Partners can view incoming applications in real time, click into individual records, add paper applications manually, and export all application data as a CSV. Export excludes demographic data for partners per Fair Housing Law.
- **Duplicate Detection** - The system automatically flags potential duplicate applications based on matching name/date of birth or email address. Partners can review flagged applications and resolve them; duplicates are labeled rather than deleted.
- **Preferences Management** - Partners users can create, edit, and duplicate housing preferences (e.g., live/work preferences), including response options and address collection fields.
- **User Management** - Partners users with appropriate permissions can create new users and give them access to specific listings.
- **Lottery Functionality** - Administrative users can run and review an automated lottery process in their portal. They can audit those results by downloading a CSV, and push the results directly to applicant accounts.
- **Search & Filter** - Keyword search for listings (by name) and users (by name, email, or associated listing) for appropriate permission types.

## Configurable functionality

Much of the Bloom portal's functionality is configurable per jurisdiction and environment.
The primary mechanism for this is feature flags. See the [Feature Flags](./feature-flags.md) documentation for more details.
