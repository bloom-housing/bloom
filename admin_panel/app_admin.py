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
   Description: Flask admin control panel for managing pipeline settings,
                switching models, and viewing logs and environment info.
"""

from flask import Flask, render_template, request, redirect, url_for
import json
import os
from optimize import detect_environment, recommend_defaults

app = Flask(__name__)
SETTINGS_FILE = "casalingua_settings.json"
LOG_FILE = "casalingua_audit_log.jsonl"

def get_settings():
    if not os.path.exists(SETTINGS_FILE):
        return {
            "simplification_model": "mistral-7b-instruct.Q4_K_M.gguf",
            "translation_model": "Helsinki-NLP/opus-mt-en-es",
            "enable_chain_of_thought": True,
            "enable_pii_masking": True,
            "verbose_logging": True
        }
    with open(SETTINGS_FILE) as f:
        return json.load(f)

def save_settings(settings):
    with open(SETTINGS_FILE, 'w') as f:
        json.dump(settings, f, indent=2)

@app.route("/admin", methods=["GET", "POST"])
def admin():
    settings = get_settings()
    if request.method == "POST":
        settings["simplification_model"] = request.form.get("simplification_model")
        settings["translation_model"] = request.form.get("translation_model")
        settings["enable_chain_of_thought"] = bool(request.form.get("enable_chain_of_thought"))
        settings["enable_pii_masking"] = bool(request.form.get("enable_pii_masking"))
        settings["verbose_logging"] = bool(request.form.get("verbose_logging"))
        save_settings(settings)
        return redirect(url_for("admin"))

    recent_logs = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            lines = f.readlines()[-10:]
            recent_logs = [json.loads(line) for line in lines if line.strip()]

    env = detect_environment()
    recommended = recommend_defaults(env)

    return render_template("admin.html", settings=settings, logs=recent_logs, env=env, recommended=recommended)

if __name__ == "__main__":
    app.run(port=5050, debug=True)
