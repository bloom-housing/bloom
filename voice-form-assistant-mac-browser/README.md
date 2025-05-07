# 🎙️ Voice-to-Form Assistant (Mac Browser Edition)

This assistant runs locally or in Docker and lets users fill out forms via voice — with Whisper ASR, translation, field extraction, and spoken summaries.

---

## 🪜 Ladder Logic: Voice-to-Form Flow
```text
1. User lands on the assistant web page
2. Uploads or records audio using browser mic
3. Whisper transcribes the speech
4. Language is detected and translated if needed
5. Named Entity Recognition (NER) extracts entities
6. Inferred fields are mapped to form structure
7. User reviews and edits form fields
8. Assistant reads back the summary in user's language
9. User confirms and optionally submits to Bloom backend
```

---

## 🧪 Local Usage (macOS)
1. Ensure Python 3.10+ is installed.
2. From terminal:
   ```bash
   pip install -r requirements.txt
   python voice_to_form_microservice.py
   ```
3. Open browser at `http://localhost:5001`

---

## 🐳 Docker Usage (Optional)
1. From terminal:
   ```bash
   docker compose up --build
   ```
2. Then visit: `http://localhost:5001`

---

## 🔐 API Key Auth (Optional)
Set a `.env` file:
```env
VOICE_SERVICE_API_KEY=your_secret_key
```
Use `X-API-KEY` header for secure access.

---

## 🔄 Integration
Use the `/process-audio` POST endpoint to submit audio files and receive structured data in return.