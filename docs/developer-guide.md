# CasaLingua Developer Guide

This guide provides technical implementation details, setup instructions, and architecture notes for developers working with the CasaLingua system.

---

## Project Structure
```
app/
├── api/routes/
├── core/pipeline/
├── core/document/
├── utils/
├── audit/
├── admin/
```
Supporting files include:
* Config files: `.env`, `template.env`, `production.json` - Configuration
* Bootstrap and diagnostics: `install.sh`, `health_check.py`

---

## Local Development Setup
### 1. System Requirements
* Python 3.10+
* PostgreSQL 15 (running on port `5433`)
* Node.js/Yarn (for Bloom integration or Admin UI)

### 2. Installation

```bash
# Clone Bloom Monorepo
cd ~/bloom

# Set up Postgres
psql -U bloom -p 5433
CREATE DATABASE bloom_prisma;

# Backend setup
cd ~/bloom/api
cp .env.template .env
export DATABASE_URL=postgresql://bloom:bloompass@127.0.0.1:5433/bloom_prisma

# Start services
yarn setup:dev
yarn db:seed:development --jurisdictionName Bloomington
```

## 3. Frontend (Optional)
```bash
cd ~/bloom/sites/public
cp .env.template .env
export NEXT_PUBLIC_JURISDICTION_NAME=Bloomington

yarn dev -H 0.0.0.0 -p 3000
```
---

# Model and Pipeline Overview
## Key Components
  * Language Detector – Auto routes input to correct NLP task
  * Simplifier – RAG + transformer-backed clause simplifier with jurisdiction and reading level controls
  * Translator – MarianMT, BLOOM, or LoRA-quantized custom models
  * PII Anonymizer – Regex + NER-based redactor
  * TTS (Optional) – `pyttsx3` fallback for offline narration

## Model Registry (`app/core/registry.py`)
All models and services are hot-loadable based on:
  * Hardware availability
  * Task class (`translation`, `simplification`, etc.)
  * Admin settings

# Developer Features
  * Rich logging (`colorama`, `loguru`, `structlog`)
  * `@rate_limit`, `@auth_required`, and `@role_protected` decorators
  * Modular pipeline swapping (hot-replace `simplify.py` logic)
  * Local session memory per request (no persistent PII)
  * SHAP + alignment overlays for human reviewer workflows

# Health, Testing, and Debugging
## Health Checks
  * `GET /health` – Basic readiness
  * `GET /admin/status` – Detailed model/service diagnostics
  * `health_check.py` – CLI tool for smoke tests
## Testing
  * Unit: `pytest`, `pytest-asyncio`, `faker`
  * Coverage: `pytest-cov`
  * E2E (coming soon): Model contract + integration tests

# Troubleshooting Tips
  * TypeScript mismatch (e.g. `ReadonlyDeep_2`) → use `any` or remove internal Prisma type export
  * Prisma `.update()` missing relations → use `include: {...}` for activity logs and sub-relations
  * WebSocket hot reload devtool error → harmless
  * Ensure `NEXT_PUBLIC_JURISDICTION_NAME` is set for frontend to avoid Axios errors

# Deployment Notes
  * Docker support in progress (`docker-compose.yml`)
  * Recommended: systemd unit files for production startup
  * NGINX proxy routing: `/ → frontend`, `/api → FastAPI`
  * HTTPS via Let’s Encrypt or self-signed cert

# Compliance and Auditing
  * All sessions are hashed + ephemeral
  * Audit logs include:
    * Pipeline stages
    * Confidence scores
    * Simplification alignment and flagged drifts
  * Alignment with [Exygy Responsible AI Framework](https://exygy.com/) includes:
    * Bias detection placeholders
    * Human oversight workflows
    * Transparent output verification
---
For endpoint details, refer to the [API Reference](./api-reference.md). For usage instructions, see the [User Guide](./user-guide.md).

