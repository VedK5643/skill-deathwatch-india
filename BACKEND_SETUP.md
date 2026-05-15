# Skill Deathwatch India — Backend Setup Guide

> **Who is this for?** Anyone setting up the automated data pipeline for the first time.
> After completing these steps, the system runs **fully automatically every Monday at 6AM IST**. You never touch it again.

---

## Architecture Overview

```
GitHub Actions (cron, every Monday 6AM IST)
    ↓
scripts/snapshot.py
    ↓
Adzuna Jobs API (40 skill queries)
    ↓
Supabase PostgreSQL (skill_snapshots table)
    ↑
Next.js / Vite Frontend (reads via anon key)
```

---

## Step 1 — Get Adzuna API Keys

1. Go to **https://developer.adzuna.com**
2. Click **Register** → sign up with your email
3. Once logged in, click **"Create Application"**
4. Name it `Skill Deathwatch India` → click Submit
5. Your dashboard will show your **APP_ID** and **APP_KEY**
6. Copy both — you'll need them in Step 3 and Step 4

---

## Step 2 — Set Up Supabase

1. Go to **https://supabase.com** → create a free account
2. Click **"New Project"** → name it `skill-deathwatch-india`
3. Choose a region close to India (e.g., `ap-south-1` Mumbai)
4. Wait ~2 minutes for the project to provision
5. In the left sidebar, click **SQL Editor**
6. Click **"New Query"**
7. Copy the **entire contents** of `supabase/migrations/001_create_skill_snapshots.sql`
8. Paste it into the SQL Editor → click **Run**
9. You should see: `Success. No rows returned` — the table is created ✅
10. Go to **Project Settings → API**
11. Copy the **"Project URL"** → this is your `SUPABASE_URL`
12. Under **"Project API Keys"**, copy the **`service_role`** key
    - ⚠️ Use `service_role`, NOT `anon` — the cron script needs write access
    - This is your `SUPABASE_SERVICE_ROLE_KEY`
13. Also copy the **`anon`** (public) key → this is your `VITE_SUPABASE_ANON_KEY` (for the frontend)

---

## Step 3 — Test Locally First

> This confirms the pipeline works before automating it.

**3a. Set up Python credentials**

```bash
# From the project root:
copy scripts\.env.example scripts\.env
```

Open `scripts/.env` and fill in all 4 values:

```env
ADZUNA_APP_ID=your_app_id_here
ADZUNA_APP_KEY=your_app_key_here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key...
```

**3b. Install Python dependencies**

```bash
cd scripts
pip install -r requirements.txt
```

**3c. Run the snapshot script**

```bash
python snapshot.py
```

You should see output like:
```
=======================================================
  Skill Deathwatch India — Snapshot Run
  Timestamp : 2025-05-15 12:00:00
  ISO Week  : 20 / 2025
  Skills    : 41
=======================================================
  Python: 12,450 jobs ✓
  Java: 8,230 jobs ✓
  JavaScript: 9,100 jobs ✓
  ...
```

**3d. Verify in Supabase**

1. Go to your Supabase project → **Table Editor**
2. Click on **`skill_snapshots`**
3. You should see 40+ rows — one per skill ✅

If rows appear, the pipeline works. Move to Step 4.

---

## Step 4 — Set Up Frontend Environment Variables

**4a. Create `.env.local`** in the project root:

```bash
copy .env.local.example .env.local
```

Fill in:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your_anon_key...
```

> Note: The frontend uses the **anon** key (read-only via RLS), NOT the service_role key.

**4b. Install the Supabase JS client** (if not already installed):

```bash
npm install @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

**4c. Start the dev server**:

```bash
npm run dev
```

The frontend will now read live data from Supabase instead of mock data.

---

## Step 5 — Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"** and add **each** of these 4 secrets:

| Secret Name | Value |
|---|---|
| `ADZUNA_APP_ID` | Your Adzuna App ID |
| `ADZUNA_APP_KEY` | Your Adzuna App Key |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key |

> ⚠️ The names must match exactly — the workflow file references these exact names.

---

## Step 6 — Test the GitHub Actions Workflow

1. **Push all your code** to GitHub:
   ```bash
   git add .
   git commit -m "feat: add automated skill snapshot pipeline"
   git push
   ```

2. Go to your repo → **Actions** tab
3. Click **"Weekly Skill Snapshot"** in the left sidebar
4. Click **"Run workflow"** → **"Run workflow"** (manual trigger)
5. Watch the run — it should complete in ~2–3 minutes
6. Go back to **Supabase Table Editor** — you should see 40 more rows added ✅
7. If the run is **green**, you're done 🎉

---

## Step 7 — Deploy Frontend to Vercel

1. Go to **https://vercel.com** → import your GitHub repo
2. In Vercel project settings → **Environment Variables**, add:
   - `VITE_SUPABASE_URL` → your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` → your anon key
3. Deploy → your frontend reads live data from Supabase in production

---

## What Happens Every Monday Automatically

| Time | Action |
|---|---|
| 06:00 IST | GitHub Actions wakes up |
| 06:01 IST | `snapshot.py` starts querying Adzuna API |
| ~06:03 IST | 40 new rows inserted into Supabase |
| Immediately | Frontend charts show updated data |
| If failure | GitHub emails you automatically |

**You do nothing.** 🎉

---

## Troubleshooting

### "No rows in Supabase after running locally"
- Check `scripts/.env` has all 4 values filled in (not the placeholder text)
- Check the SQL migration ran successfully in Supabase SQL Editor

### "FAILED: [skill_name] — 401 Unauthorized" in script output
- Your `ADZUNA_APP_ID` or `ADZUNA_APP_KEY` is wrong
- Double-check at https://developer.adzuna.com/dashboard

### "FAILED (DB): [skill_name]" in script output
- Your `SUPABASE_SERVICE_ROLE_KEY` might be wrong (make sure it's service_role, not anon)
- Check if the SQL migration ran (table must exist first)

### GitHub Actions run fails with "Missing required environment variables"
- Check that all 4 secrets are added with the **exact names** shown in Step 5

### Frontend shows no data / "placeholder.supabase.co" errors
- Add `.env.local` in the project root with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after adding env vars

---

## File Reference

```
skill-deathwatch-india/
├── .github/
│   └── workflows/
│       └── weekly-scrape.yml        ← GitHub Actions cron job
├── scripts/
│   ├── snapshot.py                  ← Main cron script
│   ├── skills_config.json           ← 40 tracked skills (single source of truth)
│   ├── requirements.txt             ← Python dependencies
│   ├── .env.example                 ← Template — copy to .env and fill in
│   └── .env                        ← Your real secrets (gitignored)
├── supabase/
│   └── migrations/
│       └── 001_create_skill_snapshots.sql  ← Run once in Supabase SQL Editor
├── client/src/lib/
│   └── supabase.ts                  ← Frontend Supabase client (anon key)
├── .env.local.example               ← Frontend env template
└── .env.local                       ← Your frontend secrets (gitignored)
```
