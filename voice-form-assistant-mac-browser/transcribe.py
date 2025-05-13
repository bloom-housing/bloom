from faster_whisper import WhisperModel

model = WhisperModel("tiny", device="cpu", compute_type="int8")

def transcribe_audio(file_path):
    segments, info = model.transcribe(file_path)
    return " ".join([seg.text for seg in segments]), info.language