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
---
### 1. `POST /translate`
Translate text from one language to another.
- `text`: string – REQUIRED
- `target_language`: string, ISO 639-1 code – REQUIRED
- `source_language`: override - OPTIONAL
---
### 2. `POST /translate/batch`
Translate multiple texts at once.
* ## Body Parameters:
  * `texts` (array of strings)
  * `target_language` (string)

---
### 3. `POST /detect` or `/detect-language`
Auto-detect the input language.
* ## Body Parameters:
  * `text` (string)


---
### 4. `POST /simplify`
Simplify legal text by jurisdiction and reading level.
* ## Body Parameters:
  * `text` (string) REQUIRED
  * `jurisdiction` (string, e.g. "detroit")
  * `reading_level` (string, default: "plain")

---
### 5. `POST /anonymize`
Redact PII using NER + regex.
* ## Body Parameters:
  * `text` (string)


---
### 6. `POST /analyze`
Full pipeline: detect → simplify → translate → anonymize.
* ## Body Parameters:
  * `text` (string)
  * `target_language` (string)
  * `jurisdiction` (string)

---
### 7. `POST /summarize`
Summarize long-form input.
* ## Body Parameters:
  * `text` (string)

---
### 8. `POST /rag/translate`
Retrieval-augmented translation.
* ## Body Parameters:
  * `text` (string)
  * `target_language` (string)
---
### 9. `POST /rag/query`
Ask a question against the housing knowledge base.
* ## Body Parameters:
  * `query` (string)
  * `jurisdiction` (string)
---
### 10. `POST /rag/chat`
Chat-like interface with session support.
* ## Body Parameters:
  * `message` (string)
  * `session_id` (string, optional)

---
### 11. `POST /verify`
Validate translation/simplification fidelity.
* ### Body Parameters:
  * `original` (string)
  * `generated` (string)
* ### Returns:
  *  Alignment score, semantic drift indicators, NER consistency

---
### 12. `GET /bloom-housing/*`
Bloom-specific pre-integrated endpoints.
* ### Routes:
  * `/bloom-housing/metadata`
  * `/bloom-housing/translate-doc`

---
### 13. `GET /streaming/*`
Streaming versions of simplify/translate endpoints (TTS, large docs).

---
## Health & Diagnostics
- `GET /health` – Basic ping; returns status of database connection, loaded models, etc.
- `GET /admin/status` – Admin-only model and pipeline services and states

---
## Error Codes
* `400 Bad Request` – Invalid or missing parameters
* `401 Unauthorized` – JWT/API key missing or invalid
* `403 Forbidden` – Permission denied for role
* `500 Internal Server Error` – Unexpected pipeline failure

---
## Notes
* All responses follow a consistent schema with `success`, `data`, and `error` fields.
* Pipeline components are independently replaceable and configurable via `/admin/*` endpoints.
* For large documents or audio uploads, use the file upload endpoints (coming soon).

---

For integration tips, see the [Developer Guide](./developer-guide.md).
