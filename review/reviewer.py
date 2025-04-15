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
   Description: Human-in-the-loop review module for approving, editing,
                and flagging PII or legal risk in simplified outputs.
"""

from admin.audit_logger import log_reviewer_action
from pipeline.ner import extract_entities
from typing import Dict

def review_document(doc_id: str, simplified: str, reviewer_edits: str, reviewer_id: str) -> Dict:
    """
    Stores and evaluates a reviewer's edits. Flags any fields that were redacted
    or detected as sensitive, and logs reviewer contributions.
    """
    log_reviewer_action(doc_id, reviewer_id, reviewer_edits)
    entities = extract_entities(reviewer_edits)
    flags = []

    for field, value in entities.items():
        if value == "[REDACTED]":
            flags.append(f"🔒 Reviewer edit contains redacted {field.replace('_', ' ')}")

    return {
        "doc_id": doc_id,
        "reviewed_by": reviewer_id,
        "final_text": reviewer_edits,
        "flags": flags or ["✅ No sensitive issues detected"],
        "entity_snapshot": entities
    }
