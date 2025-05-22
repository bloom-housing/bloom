# CasaLingua User Guide

CasaLingua is a tool designed to simplify and translate housing documents into plain language and multiple languages, with legal accuracy and cultural sensitivity. This guide walks you through using CasaLingua via the Bloom platform or directly via API.

---

## Who This Is For
- **Tenants** trying to understand leases or rights
- **Landlords** needing to communicate across languages
- **Housing Navigators** assisting clients with applications and documents

---

## What CasaLingua Can Do
✅ Translate documents into over a dozen languages 
✅ Simplify legal text by jurisdiction and reading level 
✅ Redact personal or sensitive information
✅ Provide plain-language summaries
✅ Offer optional audio output (Text-to-Speech)

---

## Using CasaLingua via Bloom

### Step 1: Log Into Bloom
Navigate to your jurisdiction’s Bloom portal and sign in.

### Step 2: Upload a Document
You can upload any of the following:
- Lease or rental agreement
- Eviction or rent notice
- Public housing eligibility letter
- Any `PDF`, `DOCX`, image, or pasted text

### Step 3: Choose Your Action
After upload, you’ll be asked what you’d like to do:
- **Translate** the document
- **Simplify** the legal language
- **Both** (recommended)

### Step 4: Select Your Language and Jurisdiction
- CasaLingua will auto-detect language, but you can override it.
- Choose the relevant jurisdiction (e.g. Detroit, Alameda, SF).

### Step 5: Review Output
You’ll see:
- Original and simplified/translated text side-by-side
- Highlights for changes or areas flagged for review
- Audio button for optional Text-to-Speech

### Step 6: Download, Share, or Send
Once reviewed, you can:
- Download the results (`PDF` or text)
- Share a copy with your caseworker or landlord
- Flag sections for further human review

---

## Using CasaLingua via API

For developers or partners integrating CasaLingua:
- Use `POST /simplify` for legal plain-language conversion
- Use `POST /translate` or `POST /analyze` for combined workflows
- Authentication is required via JWT or API Key

Refer to the [API Reference](./api-reference.md) for endpoint specs.

---

## Tips for Better Results
- When uploading PDFs, make sure the text is selectable (not scanned images)
- Use clear jurisdiction and document type hints in your uploads
- Use the SHAP explanation overlays (if enabled) to understand model decisions

---

## Languages Supported (as of v1.0)
- English, Spanish, Chinese, Vietnamese, Korean, Tagalog, Arabic, Russian, Haitian Creole, Amharic, and more.

---

## Known Limitations
- Model may request human review on edge cases or ambiguous phrases
- TTS voice defaults to gender-neutral U.S. English unless otherwise configured
- Document formatting may be altered in simplified output

---

## Need Help?
- For Bloom-related support: contact your local housing portal administrator
- For translation/simplification quality issues: use the \"Flag for Review\" option
- For integration support: see the [Developer Guide](./developer-guide.md)

> Remember: language should never be a barrier to understanding your rights or your home.

---

CasaLingua is built with accessibility, legal fidelity, and community empowerment at its core.
