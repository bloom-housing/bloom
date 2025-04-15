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
   Description: Redis-backed session tracker for maintaining per-user
                interaction context and document tokens.
"""

import redis
import uuid
import json

# Connect to local Redis instance
r = redis.Redis(host='localhost', port=6379, db=0)
SESSION_TTL = 3600  # 1 hour

def create_session() -> str:
    """Generates and stores a new session ID."""
    session_id = str(uuid.uuid4())
    r.set(session_id, json.dumps({"messages": []}), ex=SESSION_TTL)
    return session_id

def append_to_session(session_id: str, role: str, message: str):
    """Appends a new message to the session context."""
    existing = r.get(session_id)
    if existing:
        context = json.loads(existing)
        context["messages"].append({ "role": role, "message": message })
        r.set(session_id, json.dumps(context), ex=SESSION_TTL)

def get_session_context(session_id: str) -> list:
    """Returns full context for a session."""
    existing = r.get(session_id)
    if existing:
        return json.loads(existing).get("messages", [])
    return []
