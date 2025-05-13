from transcribe import transcribe_audio
from translate import translate_to_english
from extract_info import extract_entities
from field_inference import infer_fields
from gtts import gTTS

# ┌────────────────────────────┐
# │ Step 3–8: Voice Processing │
# └────────────────────────────┘
def speak_summary(text, lang='en'):
    tts = gTTS(text, lang=lang)
    path = "static/audio_summary.mp3"
    tts.save(path)
    return path

def process_form_interview(audio_path):
    # Step 3: Transcribe with Whisper
    raw_text, detected_lang = transcribe_audio(audio_path)
    print(f"Detected language: {detected_lang}")

    # Step 4: Translate to English
    if detected_lang != 'en':
        raw_text = translate_to_english(raw_text, detected_lang)

    # Step 5: Extract entities (NER)
    entities = extract_entities(raw_text)

    # Step 6: Infer structured fields
    form_fields = infer_fields(entities)

    # Step 7: Prepare spoken summary (feedback loop)
    summary = ". ".join([f"{k}: {v}" for k, v in form_fields.items()])
    audio_summary_path = speak_summary(summary, lang=detected_lang if detected_lang != 'unknown' else 'en')

    return form_fields, audio_summary_path