"""
   ██████╗ █████╗ ███████╗ █████╗ ██╗     ██╗███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ 
  ██╔════╝██╔══██╗██╔════╝██╔══██╗██║     ██║████╗  ██║██╔════╝ ██║   ██║██╔══██╗
  ██║     ███████║███████╗███████║██║     ██║██╔██╗ ██║██║  ███╗██║   ██║███████║
  ██║     ██╔══██║╚════██║██╔══██║██║     ██║██║╚██╗██║██║   ██║██║   ██║██╔══██║
  ╚██████╗██║  ██║███████║██║  ██║███████╗██║██║ ╚████║╚██████╔╝╚██████╔╝██║  ██║
   ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝

   CasaLingua - Where Language Feels Like Home
   Version: 0.20.1
   Author: TEAM 1 – James Wilson
   License: MIT
   Description: Flask GUI to test CasaLingua's text simplification and translation
                functionality in a visual local environment.
"""

from flask import Flask, render_template, request
from pipeline.simplifier import simplify_text
from pipeline.translator import translate_text
from pipeline.ner import extract_entities
from pipeline.compliance import run_compliance_check
from review.reviewer import review_document
import uuid
import datetime

VERBOSE = True

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        original = request.form.get("document")
        lang = request.form.get("language")
        reviewer_id = request.form.get("reviewer_id") or "anonymous"

        doc_id = str(uuid.uuid4())
        timestamp = datetime.datetime.now().isoformat()

        if VERBOSE:
            print(f"\n[INPUT] Text received at {timestamp}")
            print("[STEP] Simplifying...")

        simplified = simplify_text(original)
        translated = translate_text(simplified, lang)
        compliance = run_compliance_check(original, simplified)
        reviewed = review_document(doc_id, simplified, simplified, reviewer_id)

        if VERBOSE:
            print("[STEP] Review complete.")
            print(f"[PII FLAGS] {reviewed['flags']}")

        return render_template("gui.html",
                               doc_id=doc_id,
                               original=original,
                               simplified=simplified,
                               translated=translated,
                               compliance=compliance,
                               reviewer_output=simplified,
                               reviewer_id=reviewer_id,
                               flags=reviewed['flags'],
                               entity_snapshot=reviewed['entity_snapshot'],
                               language=lang)
    return render_template("gui.html")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
