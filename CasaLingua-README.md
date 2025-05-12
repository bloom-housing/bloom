# CasaLingua

CasaLingua is a multilingual, AI-powered translation and simplification tool that makes complex housing documents more accessible. Developed as an add-on to the Bloom Housing platform, CasaLingua empowers tenants, landlords, and housing navigators with legally accurate, culturally relevant content—delivered in plain language.

---

## :bulb: Why CasaLingua?
Housing paperwork is often filled with legal jargon, complex policy references, and inconsistencies across jurisdictions. For many people, this creates confusion and barriers to stable housing.

CasaLingua ensures that language is never a reason someone doesn’t understand their rights, responsibilities, or next steps.

---

## :gear: Key Capabilities
- **Multimodal Input Support**: Accepts PDFs, DOCX, audio, text, and image-based documents (OCR)
- **Legal Text Simplification**: Converts complex clauses into plain language—tailored by jurisdiction and reading level
- **Multilingual Translation**: Translates content with cultural and regional accuracy using LLMs fine-tuned on housing domains
- **PII Detection**: Redacts personal identifiers automatically
- **TTS Output (Optional)**: Generates audio for translated and simplified text
- **Human Review Interface**: Side-by-side review tools with semantic drift and model transparency overlays

---

## :building_construction: System Architecture
CasaLingua is built on FastAPI with a modular backend and supports parallelized NLP pipelines:
- Language Detection
- Legal Simplification (RAG + transformers)
- Translation (MarianMT, BLOOM, etc.)
- Anonymization and TTS
- Admin-configurable model loading and session control

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
- Simplified leases
- Translated checklists and program guides
- Rights explanations in plain language

---

## :computer: Quickstart (Local Dev)
```bash
# 1. Clone the Bloom monorepo
cd ~/bloom

# 2. Create and seed database
psql -U bloom -p 5433 -c 'CREATE DATABASE bloom_prisma;'
yarn db:seed:development --jurisdictionName Bloomington

# 3. Start backend
cd api
yarn setup:dev

# 4. Start frontend (optional)
cd ../sites/public
yarn dev -H 0.0.0.0 -p 3000

# 5. Open http://localhost:3000 or /api/health
```

---

## :books: Documentation
- [User Guide](./docs/user-guide.md) – Step-by-step usage guide
- [API Reference](./docs/api-reference.md) – Route specs and parameters
- [Developer Guide](./docs/developer-guide.md) – Setup, pipelines, deployment

---

## :shield: Ethical Compliance
CasaLingua adheres to Exygy’s Responsible AI Framework:
- Human-in-the-loop design
- Bias-aware simplification and translation
- Model transparency via SHAP overlays and alignment logging

---

> "Language should never be the reason someone doesn’t understand where they live."
