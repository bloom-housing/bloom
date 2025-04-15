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
   Description: Named Entity Recognition (NER) module for extracting key
                PII and application fields in housing documents.
"""

import spacy
import re
from typing import List, Dict

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Fields to extract
NER_FIELDS = [
    "full_name", "date_of_birth", "address", "phone_number", "email",
    "social_security_number", "household_size", "monthly_income",
    "employer", "rental_history", "landlord_name", "landlord_contact",
    "disability_status", "veteran_status", "immigration_status", "preferred_language"
]

# PII patterns
PII_PATTERNS = {
    "email": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
    "phone_number": r"(\+\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})",
    "social_security_number": r"\b\d{3}-\d{2}-\d{4}\b"
}

def extract_entities(text: str) -> Dict[str, str]:
    """
    Extracts and masks sensitive fields from the input text.
    Returns a dictionary of relevant application info.
    """
    doc = nlp(text)
    extracted = {field: "" for field in NER_FIELDS}

    for ent in doc.ents:
        if ent.label_ == "PERSON" and not extracted["full_name"]:
            extracted["full_name"] = ent.text
        if ent.label_ == "DATE" and not extracted["date_of_birth"]:
            extracted["date_of_birth"] = ent.text
        if ent.label_ == "GPE" and not extracted["address"]:
            extracted["address"] = ent.text
        if ent.label_ == "ORG" and not extracted["employer"]:
            extracted["employer"] = ent.text
        if ent.label_ == "CARDINAL" and not extracted["household_size"]:
            extracted["household_size"] = ent.text

    # Regex-based redactions
    for field, pattern in PII_PATTERNS.items():
        match = re.search(pattern, text)
        if match:
            extracted[field] = "[REDACTED]"

    return extracted
