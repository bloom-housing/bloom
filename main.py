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
   Description: Main entrypoint for the CasaLingua system. Handles CLI startup,
                system initialization, and launches the FastAPI service.
"""

import uvicorn
from fastapi import FastAPI
from api.routes import router
import logging

# Setup a beautiful log header
logging.basicConfig(level=logging.INFO, format='[CasaLingua] %(asctime)s - %(message)s')

app = FastAPI(
    title="CasaLingua API",
    description="Ethical AI for Simplifying and Translating Housing Documents",
    version="0.20.1"
)

# Include all route endpoints
def start_casalingua():
    logging.info("🚀 Starting CasaLingua API service...")
    app.include_router(router)
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    start_casalingua()
