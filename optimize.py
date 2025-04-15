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
   Description: Runtime diagnostics and model recommendation system for
                system-aware CasaLingua deployments.
"""

import platform
import psutil
import shutil
import os

def detect_environment():
    return {
        "os": platform.system(),
        "machine": platform.machine(),
        "ram_gb": round(psutil.virtual_memory().total / 1e9, 1),
        "cores": psutil.cpu_count(logical=True),
        "has_cuda": shutil.which("nvidia-smi") is not None,
        "is_macos_m": platform.system() == "Darwin" and platform.machine() == "arm64",
        "python": platform.python_version()
    }

def recommend_defaults(env):
    if env["is_macos_m"]:
        return {
            "llm_runner": "Ollama (Metal)",
            "translation_engine": "MarianMT or Transformers (MPS)",
            "notes": "Optimized for Apple Silicon (M1/M2/M4)"
        }
    elif env["has_cuda"]:
        return {
            "llm_runner": "llama.cpp CUDA or Transformers GPU",
            "translation_engine": "NLLB or MarianMT (GPU)",
            "notes": "NVIDIA GPU detected - enable CUDA"
        }
    else:
        return {
            "llm_runner": "llama.cpp (Q4 CPU)",
            "translation_engine": "MarianMT CPU",
            "notes": "No GPU - using CPU-friendly settings"
        }
