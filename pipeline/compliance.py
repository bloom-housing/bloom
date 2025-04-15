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
   Description: Lightweight legal compliance module to ensure
                critical obligations are preserved in simplified text.
"""

def run_compliance_check(original: str, simplified: str) -> dict:
    """
    Checks whether key legal concepts (keywords) are still present
    in the simplified version of the housing document.
    """
    keywords = [
        "notice", "rent", "deposit", "termination",
        "violation", "right", "obligation", "landlord", "tenant"
    ]
    missing = [kw for kw in keywords if kw in original.lower() and kw not in simplified.lower()]
    return {
        "ok": len(missing) == 0,
        "notes": f"Missing keywords: {', '.join(missing)}" if missing else "All critical terms preserved."
    }
