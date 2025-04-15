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
   Description: API endpoints for simplification, translation, and session-aware
                processing of housing documents.
"""

from fastapi import APIRouter, HTTPException
from api.schema import SimplifyRequest, SimplifyResponse
from pipeline.fastlane import fast_simplify_and_translate

router = APIRouter()

@router.post("/api/simplify", response_model=SimplifyResponse)
def simplify_api(req: SimplifyRequest):
    """
    Accepts a document string and optional language code, returns simplified and translated text.
    Other processes like NER, audit logging, compliance check run in background.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text field is empty.")

    return fast_simplify_and_translate(req.text, req.lang, reviewer_id="api_request")
