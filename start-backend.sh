#!/bin/bash
cd "$(dirname "$0")"
deactivate 2>/dev/null || true
. ./backend/venv/bin/activate
cd backend
uvicorn main:app --reload --port 8000
