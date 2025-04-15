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
   Description: Translation module to convert plain English output
                into a user’s preferred language.
"""

from transformers import MarianMTModel, MarianTokenizer

# Load MarianMT Spanish model
tokenizer = MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-en-es")
model = MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-en-es")

def translate_text(text: str, lang: str = "en") -> str:
    """
    Translates English text to target language if not English.
    Currently supports English → Spanish (lang='es').
    """
    if lang == "en":
        return text
    inputs = tokenizer([text], return_tensors="pt", padding=True)
    outputs = model.generate(**inputs)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
