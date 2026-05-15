# 📉 Skill Deathwatch India

> **Is your skill dying? Hiring data knows.**

Tracks weekly job market demand for 40+ tech skills across India — updated every Monday automatically using real hiring data. No opinions. No surveys. Just numbers.

🔗 **Live Site:** _Coming June 1, 2025_ <!-- Replace with actual URL after deployment -->

---

## The Problem

Every student and developer in India Googles _"is [skill] worth learning in 2025?"_ and gets opinion articles written by people with no data behind them.

This site answers that question with actual weekly job listing counts from the Indian market — accumulated over time so you can see the trend, not just a snapshot.

---

## What It Does

- 📊 Tracks job listing counts for 40+ tech skills weekly
- 📈 Plots historical trend graphs per skill
- ⚔️ Head-to-head skill comparison (e.g. Selenium vs Playwright)
- 🔥 Weekly digest — biggest movers every Monday
- 🇮🇳 India-specific data only

---

## Screenshots

> _Coming after deployment_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Data Source | [Adzuna Jobs API](https://developer.adzuna.com) (official, free tier) |
| Automation | GitHub Actions (cron — every Monday 6AM IST) |
| Database | Supabase (PostgreSQL) |
| Frontend | Next.js + TypeScript |
| Charts | Recharts |
| Hosting | Vercel |

---

## Architecture

```
Every Monday 6AM IST
        │
        ▼
GitHub Actions (cron)
        │
        ▼
scripts/snapshot.py
  → Calls Adzuna API for each skill
  → Stores { skill_name, job_count, recorded_at } in Supabase
        │
        ▼
Supabase (PostgreSQL)
  → Single table: skill_snapshots
        │
        ▼
Next.js Frontend
  → Reads from Supabase
  → Renders trend graphs
        │
        ▼
Vercel (deployed)
```

Zero manual intervention after setup. Fully automated.

---

## Skills Tracked

| Category | Skills |
|---|---|
| Programming Languages | Python, Java, JavaScript, TypeScript, C++, Go, Rust, Kotlin |
| Frontend | React, Angular, Vue.js, Next.js, HTML/CSS |
| Backend | Node.js, Django, Spring Boot, FastAPI, Flask |
| Data & Analytics | SQL, Power BI, Tableau, Excel, Pandas, Spark |
| DevOps & Cloud | AWS, Azure, GCP, Docker, Kubernetes, Terraform, Jenkins |
| Testing | Selenium, Playwright, Cypress, JUnit, Postman |
| AI / ML | TensorFlow, PyTorch, Scikit-learn, LangChain, Hugging Face |

---

## Database Schema

```sql
CREATE TABLE skill_snapshots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name   VARCHAR(100) NOT NULL,
  category     VARCHAR(50)  NOT NULL,
  job_count    INTEGER      NOT NULL,
  recorded_at  TIMESTAMP    NOT NULL,
  week_number  INTEGER      NOT NULL,
  year         INTEGER      NOT NULL
);
```

One table. Every feature on the frontend is a query on this table.

---

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase account (free)
- Adzuna API key (free — [developer.adzuna.com](https://developer.adzuna.com))

### Steps

```bash
# Clone the repo
git clone https://github.com/VedK5643/skill-deathwatch-india.git
cd skill-deathwatch-india

# Install frontend dependencies
cd client
npm install

# Copy env file and fill in your keys
cp .env.local.example .env.local
```

Fill in `.env.local`:
```
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# Run the snapshot script manually (test data pipeline)
cd ../scripts
pip install -r requirements.txt
python snapshot.py

# Start frontend
cd ../client
npm run dev
```

---

## Automated Data Pipeline

The GitHub Actions workflow runs every Monday at 6AM IST:

```yaml
on:
  schedule:
    - cron: '30 0 * * 1'  # Monday 6AM IST
  workflow_dispatch:       # Manual trigger for testing
```

Secrets required in your GitHub repo settings:
- `ADZUNA_APP_ID`
- `ADZUNA_APP_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`

---

## Important Disclaimer

Job counts are **relative trend indicators** — useful for spotting direction, not for quoting exact numbers. A spike or drop in a single week can reflect seasonal hiring patterns. Always look at the 8–12 week trend, not one data point.

Data is sourced from Adzuna's job index for India. Not affiliated with Adzuna.

---

## Roadmap

- [x] Automated weekly data pipeline
- [x] Skill dashboard with trend indicators
- [x] Individual skill pages with historical graphs
- [x] Head-to-head comparison
- [x] Weekly digest page
- [ ] City-level breakdown (Mumbai, Bangalore, Jaipur etc.)
- [ ] Salary correlation data
- [ ] Skill bundle clusters ("If you know X, also learn Y")
- [ ] Email alerts for skill threshold drops

---

## Built By

**Vedagya** — BTech CSE student at JECRC Foundation, Jaipur.

Built this because I was tired of "just learn Python bro" advice with nothing behind it.

---

## License

MIT — free to use, fork, and build on.

---

_Data updates every Monday. Last pipeline run status: check [Actions tab](../../actions)_
