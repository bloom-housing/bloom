# CasaLingua Developer Guide

This guide provides technical implementation details, setup instructions, and architecture notes for developers working with the CasaLingua system.

---

## Project Structure
app/
├── api/routes/
├── core/pipeline/
├── core/document/
├── utils/
├── audit/
├── admin/

Config files: `.env`, `template.env`, `install.sh`, `health_check.py`

---

## Setup

```bash
# PostgreSQL running on port 5433
psql -U bloom -p 5433
CREATE DATABASE bloom_prisma;
```

# Backend
```bash
cd ~/bloom/api
yarn setup:dev
yarn db:seed:development --jurisdictionName Bloomington
```

# Frontend
```bash
cd ~/bloom/sites/public
yarn dev
```

# Pipelines
- Language detection

- Simplification: RAG + Transformer + Rule-based fallback

- Translation: MarianMT, BLOOM, LoRA

- TTS: pyttsx3 fallback

- PII/NER anonymizer

# Model Loading
- Registry in `core/registry.py`

- Task-class aware model selection

- Hot-swappable via Admin panel

# Testing
- `pytest`, `pytest-asyncio`, `faker`

- `GET /health` for live pings`

- Coverage with `pytest-cov`

- E2E testing: in progress

# Deployment Notes
- NGINX proxy `/ → frontend`, `/api → backend`

- Optional Docker (WIP)

- HTTPS via Let's Encrypt

- Suggested: `systemd` for resilience

# Responsible AI Features
- Session logging with hash + ephemeral cache

- SHAP overlays and semantic drift

- Compliant with Exygy’s bias, audit, and reviewer framework

---
