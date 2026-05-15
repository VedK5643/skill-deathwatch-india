"""
Skill Deathwatch India — Weekly Snapshot Script
================================================
Run manually:   python scripts/snapshot.py
Run via GitHub Actions: automated every Monday at 06:00 IST

Reads all 4 credentials from environment variables.
Locally, put them in scripts/.env (never commit that file).
In GitHub Actions, add them as Repository Secrets.
"""

import json
import os
import sys
import time
import datetime

import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# ──────────────────────────────────────────────
# 1. Load environment variables
#    load_dotenv() reads scripts/.env when running locally.
#    In GitHub Actions the env block injects them directly.
# ──────────────────────────────────────────────
load_dotenv()

ADZUNA_APP_ID          = os.environ.get("ADZUNA_APP_ID")
ADZUNA_APP_KEY         = os.environ.get("ADZUNA_APP_KEY")
SUPABASE_URL           = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Validate that all required credentials are present
missing = [k for k, v in {
    "ADZUNA_APP_ID": ADZUNA_APP_ID,
    "ADZUNA_APP_KEY": ADZUNA_APP_KEY,
    "SUPABASE_URL": SUPABASE_URL,
    "SUPABASE_SERVICE_ROLE_KEY": SUPABASE_SERVICE_ROLE_KEY,
}.items() if not v]

if missing:
    print(f"[ERROR] Missing required environment variables: {', '.join(missing)}")
    print("  → Locally: create scripts/.env (copy from scripts/.env.example)")
    print("  → GitHub Actions: add them as Repository Secrets")
    sys.exit(1)

# ──────────────────────────────────────────────
# 2. Load skills config
# ──────────────────────────────────────────────
script_dir   = os.path.dirname(os.path.abspath(__file__))
config_path  = os.path.join(script_dir, "skills_config.json")

with open(config_path, "r", encoding="utf-8") as f:
    SKILLS = json.load(f)

# ──────────────────────────────────────────────
# 3. Initialize Supabase client (service_role key — write access)
# ──────────────────────────────────────────────
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# ──────────────────────────────────────────────
# 4. Calculate current ISO week & year
# ──────────────────────────────────────────────
today       = datetime.date.today()
iso_cal     = today.isocalendar()
week_number = iso_cal[1]   # ISO week number (1–53)
year        = iso_cal[0]   # ISO year

# ──────────────────────────────────────────────
# 5. Start banner
# ──────────────────────────────────────────────
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
print("=" * 55)
print("  Skill Deathwatch India — Snapshot Run")
print(f"  Timestamp : {now_str}")
print(f"  ISO Week  : {week_number} / {year}")
print(f"  Skills    : {len(SKILLS)}")
print("=" * 55)

# ──────────────────────────────────────────────
# 6. Helper: fetch job count from Adzuna with one retry
# ──────────────────────────────────────────────
ADZUNA_BASE = "https://api.adzuna.com/v1/api/jobs/in/search/1"

def fetch_job_count(skill_name: str) -> int:
    """
    Returns the job count for skill_name in India.
    Retries once on failure.
    Raises on double failure.
    """
    params = {
        "app_id":          ADZUNA_APP_ID,
        "app_key":         ADZUNA_APP_KEY,
        "what":            skill_name,
        "where":           "India",
        "results_per_page": 1,
        "content-type":    "application/json",
    }

    for attempt in (1, 2):
        try:
            response = requests.get(ADZUNA_BASE, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            return int(data["count"])
        except Exception as exc:
            if attempt == 1:
                print(f"  [RETRY] {skill_name} — attempt 1 failed: {exc}. Retrying in 2s …")
                time.sleep(2)
            else:
                raise exc  # propagate for caller to handle

# ──────────────────────────────────────────────
# 7. Main loop
# ──────────────────────────────────────────────
success_count = 0
failed_skills = []

for skill in SKILLS:
    skill_name = skill["name"]
    category   = skill["category"]

    # --- Fetch from Adzuna ---
    try:
        job_count = fetch_job_count(skill_name)
    except Exception as exc:
        print(f"  FAILED: {skill_name} — {exc}")
        failed_skills.append(skill_name)
        time.sleep(0.2)  # still rate-limit even on failure
        continue

    # --- Upsert into Supabase ---
    row = {
        "skill_name":  skill_name,
        "category":    category,
        "job_count":   job_count,
        "week_number": week_number,
        "year":        year,
        # recorded_at defaults to now() in the DB, but we set it explicitly
        # so that re-runs in the same week update the timestamp.
        "recorded_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }

    try:
        result = (
            supabase
            .table("skill_snapshots")
            .upsert(row, on_conflict="skill_name,week_number,year")
            .execute()
        )
        # supabase-py raises on error; if we get here it succeeded
        print(f"  {skill_name}: {job_count:,} jobs ✓")
        success_count += 1
    except Exception as exc:
        print(f"  FAILED (DB): {skill_name} — {exc}")
        failed_skills.append(skill_name)

    # Rate-limiting: 200ms between every API call
    time.sleep(0.2)

# ──────────────────────────────────────────────
# 8. Summary
# ──────────────────────────────────────────────
print()
print("=" * 55)
print(f"  ✅ Success : {success_count} / {len(SKILLS)} skills")
print(f"  ❌ Failed  : {len(failed_skills)} skills")
if failed_skills:
    for name in failed_skills:
        print(f"       - {name}")
print("=" * 55)

# Exit code: fail loudly if more than 5 skills failed
# (GitHub Actions will send an email alert automatically)
if len(failed_skills) > 5:
    print("\n[ALERT] More than 5 failures — marking run as FAILED.")
    sys.exit(1)

sys.exit(0)
