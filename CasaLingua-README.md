# CasaLingua README

CasaLingua is a multilingual, AI-powered translation and simplification tool that makes complex housing documents more accessible. Developed as an add-on to the Bloom Housing platform, CasaLingua empowers tenants, landlords, and housing navigators with legally accurate, culturally relevant content—delivered in plain language.

---

## :bulb: Why CasaLingua?
Housing paperwork is often filled with legal jargon, complex policy references, and inconsistencies across jurisdictions. For many people, this creates confusion and barriers to stable housing.

CasaLingua ensures that language is never a reason someone doesn’t understand their rights, responsibilities, or next steps.

---

## 🧰 Project Goals
  - Simplify legal and technical housing documents into plain language
  - Translate simplified content into multiple languages with cultural sensitivity
  - Support human-in-the-loop review workflows for accuracy and trust
  - Deploy on low-power hardware or integrate into large-scale housing systems like Bloom

---

## :gear: Key Capabilities
- **Multimodal Input Support**: Accepts PDFs, DOCX, audio, text, and image-based documents (OCR)
- **Language Detection**: Auto-detects input language to route throught appropriate pipelines
- **Legal Text Simplification**: Converts complex clauses into plain language—tailored by jurisdiction and reading level
- **Multilingual Translation**: Translates content with cultural and regional accuracy using LLMs fine-tuned on housing domains
- **PII Detection & Redaction**: Redacts personal identifiers or sensitive information automatically
- **TTS Output (Optional)**: Generates audio output for translated and simplified text
- **Human Review Interface**: Side-by-side review tools with semantic drift and SHAP model transparency overlays

---

## :building_construction: System Architecture
CasaLingua is modular, built on FastAPI and Python, with concurrent pipelines for:
- Language Detection
- Legal Simplification (RAG + transformers)
- Translation (MarianMT, BLOOM, etc.)
- Anonymization and TTS
- OCR & Audio Transcription
- Admin-configurable model loading, API key access, and session control

---

## :rocket: Deployment Options
| Environment             | Purpose                     | Example              |
|-------------------------|------------------------------|----------------------|
| Raspberry Pi 5, Jetson Nano | Field demo / offline use     | Clinics, libraries   |
| Mac M-Series             | Local dev / light deployments | Navigator laptops    |
| Docker (Bloom Integration) | Production-scale integration | Housing portals      |

---

## :world_map: Jurisdictional Coverage
CasaLingua is pre-configured for:

### Detroit
- Property Maintenance (Chapter 10)
- Rental Licensing (Chapter 41)
- Fair Housing Ordinance
- Legal Aid Hotline FAQs

### Alameda County
- Health & Housing Code
- Healthy Homes Programs
- Eviction Defense Legal Manuals

### San Francisco
- Rent Ordinance (Chapter 37)
- Planning Code (Articles 1–11)
- SFHA Policy Guides

### Federal / Model Statutes
- HUD Title 24 (Section 8, HOME)
- URLTA model law
- Fair Housing Planning Guide

---

## :link: Integration with Bloom
CasaLingua integrates directly into the Bloom Housing platform with secure, role-gated API routes. Use cases include:
- Simplified lease reviews
- Translated eligibility checklists and program guides
- Rights explanations in plain language
- Plain-language support letters

---

## :computer: Quickstart (Local Dev)
```bash
# 1. Clone and install the Bloom monorepo

# 2. Seed the bloom_prisma database on Postgres (port 5433)
psql -U bloom -p 5433 -c 'CREATE DATABASE bloom_prisma;'
yarn db:seed:development --jurisdictionName Bloomington

# 3. Start backend
cd api
yarn setup:dev

# 4. Start frontend (optional)
cd ../sites/public
yarn dev -H 0.0.0.0 -p 3000

# 5. Access the CasaLingua interface via /api/translate, /simplify, etc.

# 6. Open diagnostics via /api/health; check logs in app/audit
```

---

## :books: Documentation
- [User Guide](./docs/user-guide.md) – Step-by-step usage guide
- [API Reference](./docs/api-reference.md) – Route specs and parameters
- [Developer Guide](./docs/developer-guide.md) – Setup, pipelines, deployment

---

## :shield: Licensing and Ethical Compliance
CasaLingua adheres to Exygy’s Responsible AI guidelines for fairness, transparency and human oversight. Audit trails and model fingerprints are built-in for accountability.
Framework:
- Human-in-the-loop design
- Bias-aware simplification and translation
- Model transparency via SHAP overlays and alignment logging

---

> "Language should never be the reason someone doesn’t understand where they live."
