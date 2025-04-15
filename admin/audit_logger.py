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
   Description: Secure audit logger that masks PII and logs all interactions
                from the simplification and reviewer pipelines.
"""

import json
import datetime
import re
import os

AUDIT_LOG_PATH = "casalingua_audit_log.jsonl"

PII_PATTERNS = {
    "email": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
    "phone": r"(\+\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})",
    "ssn": r"\b\d{3}-\d{2}-\d{4}\b"
}

def sanitize_text(text: str) -> str:
    """Redacts sensitive content from logs."""
    for pattern in PII_PATTERNS.values():
        text = re.sub(pattern, "[REDACTED]", text)
    return text

def log_api_event(doc_id: str, original: str, simplified: str, translated: str, compliance: dict):
    entry = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "doc_id": doc_id,
        "event": "api_simplify",
        "compliance_ok": compliance["ok"],
        "missing_terms": compliance["notes"],
        "original_preview": sanitize_text(original[:300]),
        "simplified_preview": sanitize_text(simplified[:300]),
        "translated_preview": sanitize_text(translated[:300])
    }
    _append_to_log(entry)

def log_reviewer_action(doc_id: str, reviewer_id: str, edits: str):
    entry = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "doc_id": doc_id,
        "event": "reviewer_edit",
        "reviewer": reviewer_id,
        "final_edits": sanitize_text(edits[:300])
    }
    _append_to_log(entry)

def _append_to_log(entry: dict):
    with open(AUDIT_LOG_PATH, "a") as f:
        f.write(json.dumps(entry) + "\n")
