-- Run this entire file in Supabase SQL Editor (Project > SQL Editor > New Query)

-- ============================================================
-- TABLE: skill_snapshots
-- Stores one row per skill per week.
-- The UNIQUE constraint prevents double-inserts on re-runs.
-- ============================================================

CREATE TABLE IF NOT EXISTS skill_snapshots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name   VARCHAR(100) NOT NULL,
  category     VARCHAR(50)  NOT NULL,
  job_count    INTEGER      NOT NULL,
  recorded_at  TIMESTAMP WITH TIME ZONE DEFAULT now(),
  week_number  INTEGER      NOT NULL,
  year         INTEGER      NOT NULL,

  -- Prevents duplicate snapshot for the same skill in the same week/year
  CONSTRAINT skill_snapshots_unique_week
    UNIQUE (skill_name, week_number, year)
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Fast lookups by skill name (e.g., "give me all Python snapshots")
CREATE INDEX IF NOT EXISTS idx_skill_snapshots_skill_name
  ON skill_snapshots (skill_name);

-- Fast time-ordered queries (most-recent-first)
CREATE INDEX IF NOT EXISTS idx_skill_snapshots_recorded_at
  ON skill_snapshots (recorded_at DESC);

-- Fast lookups by week/year (e.g., "give me week 21 of 2025")
CREATE INDEX IF NOT EXISTS idx_skill_snapshots_year_week
  ON skill_snapshots (year, week_number);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE skill_snapshots ENABLE ROW LEVEL SECURITY;

-- Frontend (anon key) can SELECT — needed for charts/dashboard
CREATE POLICY "Allow public read access"
  ON skill_snapshots
  FOR SELECT
  TO anon
  USING (true);

-- Only the service_role key (used by the cron script) can INSERT
CREATE POLICY "Allow service_role to insert"
  ON skill_snapshots
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- service_role can also UPDATE (needed for upserts)
CREATE POLICY "Allow service_role to update"
  ON skill_snapshots
  FOR UPDATE
  TO service_role
  USING (true);
