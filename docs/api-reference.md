# CasaLingua API Reference

This document describes the available API endpoints provided by the CasaLingua service. All endpoints follow RESTful conventions and return JSON-formatted responses.

---

## Base URL

For local development:
- [http://localhost:3100/api](http://localhost:3100/api)

For production (Bloom integration or external):
- [https://your-domain.org/api](https://your-domain.org/api)

Authentication via JWT or API Key is required unless marked as public.

---

## Endpoints

### 1. `POST /translate`
Translate text from one language to another.
- `text`: string – Required
- `target_language`: ISO 639-1 – Required
- `source_language`: optional override

### 2. `POST /translate/batch`
Translate multiple texts at once.

### 3. `POST /detect` or `/detect-language`
Auto-detect the input language.

### 4. `POST /simplify`
Simplify legal text by jurisdiction and reading level.

### 5. `POST /anonymize`
Redact PII using NER + regex.

### 6. `POST /analyze`
Full pipeline: detect → simplify → translate → anonymize.

### 7. `POST /summarize`
Summarize long-form input.

### 8. `POST /rag/translate`
Retrieval-augmented translation.

### 9. `POST /rag/query`
Ask a question against the housing knowledge base.

### 10. `POST /rag/chat`
Chat-like interface with session support.

### 11. `POST /verify`
Validate output fidelity using alignment and entailment.

### 12. `GET /bloom-housing/*`
Bloom-specific pre-integrated endpoints.

### 13. `GET /streaming/*`
Streaming versions of simplify/translate endpoints.

---

## Health & Diagnostics

- `GET /health` – Basic ping
- `GET /admin/status` – Model and pipeline state

---

## Error Codes

- `400`, `401`, `403`, `500` with standard formats
- All responses: `{ success, data, error }`

---

For integration tips, see the [Developer Guide](./developer-guide.md).
