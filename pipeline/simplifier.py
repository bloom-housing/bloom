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
   Description: Simplifier module to convert housing documents into
                accessible plain-language using local LLMs.
"""

import subprocess

def simplify_text(text: str) -> str:
    """
    Uses a local language model via llama.cpp CLI to simplify text.
    Includes chain-of-thought logic in the prompt to preserve meaning.
    """
    prompt = f"""
Simplify the following legal housing text for an 8th grade reading level.
Explain the legal meaning first. Then rewrite it in plain English.
Preserve obligations, deadlines, and consequences.

---
{text}
---
"""
    result = subprocess.run(
        ["llama", "run", "--model", "mistral-7b-instruct.Q4_K_M.gguf", "--prompt", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        timeout=60
    )
    if result.returncode != 0:
        return "[Error during simplification]"
    return result.stdout.strip()
