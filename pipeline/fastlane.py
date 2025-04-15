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
   Description: Fastlane pipeline for non-blocking execution of AI tasks.
                Simplifies + translates immediately, logs + checks in background.
"""

from pipeline.simplifier import simplify_text
from pipeline.translator import translate_text
from pipeline.compliance import run_compliance_check
from pipeline.ner import extract_entities
from admin.audit_logger import log_api_event
from review.reviewer import review_document
import uuid
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=4)

def fast_simplify_and_translate(text: str, lang: str, reviewer_id: str = "system") -> dict:
    """Runs LLMs on the fast path, logs + validates in the background."""
    doc_id = str(uuid.uuid4())
    simplified = simplify_text(text)
    translated = translate_text(simplified, lang)
    executor.submit(run_background_tasks, doc_id, text, simplified, translated, reviewer_id)
    return {
        "document_id": doc_id,
        "simplified_text": simplified,
        "translated_text": translated,
        "language": lang
    }

def run_background_tasks(doc_id: str, original: str, simplified: str, translated: str, reviewer_id: str):
    compliance = run_compliance_check(original, simplified)
    extract_entities(simplified)
    review_document(doc_id, simplified, simplified, reviewer_id)
    log_api_event(doc_id, original, simplified, translated, compliance)
