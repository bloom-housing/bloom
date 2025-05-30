from flask import Flask, render_template, request, redirect, url_for
from main import process_form_interview
import os

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'webm', 'm4a'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Step 0: Check file type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ┌──────────────────────┐
# │ Route: Index (Home)  │
# └──────────────────────┘
@app.route('/', methods=['GET', 'POST'])
def index():
    form_result = None
    audio_url = None
    consent_given = True  # In a real app, gate this via a proper checkbox + cookie

    if request.method == 'POST':
        if 'audiofile' not in request.files or not consent_given:
            return redirect(request.url)

        file = request.files['audiofile']
        if file and allowed_file(file.filename):
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filepath)

            # Step 3–8: Whisper → Translate → NER → Field Inference → Audio Summary
            form_result, audio_url = process_form_interview(filepath)

    return render_template('index.html', result=form_result, audio_url=audio_url)

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)