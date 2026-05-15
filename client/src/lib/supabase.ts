/**
 * Supabase client — production implementation using @supabase/supabase-js
 *
 * Environment variables needed (add to a .env.local file for local dev,
 * and as Vercel Environment Variables for production):
 *
 *   VITE_SUPABASE_URL        — Project Settings > API > Project URL
 *   VITE_SUPABASE_ANON_KEY   — Project Settings > API > anon (public) key
 *
 * The frontend uses the ANON key (read-only via RLS).
 * Only the Python cron script uses the service_role key.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
    "Add them to .env.local for local dev, or to Vercel env vars for production."
  );
}

export const supabase = createClient(
  supabaseUrl  || "https://placeholder.supabase.co",
  supabaseKey  || "placeholder-anon-key"
);

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface SkillSnapshot {
  id:          string;
  skill_name:  string;
  category:    string;
  job_count:   number;
  recorded_at: string;
  week_number: number;
  year:        number;
}

// ─────────────────────────────────────────────────────────────
// Data-fetching helpers
// ─────────────────────────────────────────────────────────────

/**
 * Fetch ALL snapshots for a single skill (for the trend chart).
 * Returns rows sorted oldest-first.
 */
export async function fetchSkillSnapshots(
  skillName: string
): Promise<{ data: SkillSnapshot[]; error: string | null }> {
  const { data, error } = await supabase
    .from("skill_snapshots")
    .select("*")
    .eq("skill_name", skillName)
    .order("recorded_at", { ascending: true });

  return {
    data: (data as SkillSnapshot[]) ?? [],
    error: error ? error.message : null,
  };
}

/**
 * Fetch the most-recent snapshot for EVERY skill.
 * Used on the Home dashboard grid.
 *
 * Strategy: fetch all rows from the latest year+week combination,
 * then fall back to all rows if the table is freshly populated.
 */
export async function fetchRecentSnapshots(): Promise<{
  data: SkillSnapshot[];
  error: string | null;
}> {
  // 1. Find the latest (year, week_number) pair in the DB
  const { data: latest, error: latestError } = await supabase
    .from("skill_snapshots")
    .select("year, week_number")
    .order("year",        { ascending: false })
    .order("week_number", { ascending: false })
    .limit(1)
    .single();

  if (latestError || !latest) {
    // Table empty or not yet populated — return empty gracefully
    return { data: [], error: latestError?.message ?? null };
  }

  // 2. Fetch all skills from that week
  const { data, error } = await supabase
    .from("skill_snapshots")
    .select("*")
    .eq("year",        latest.year)
    .eq("week_number", latest.week_number)
    .order("job_count", { ascending: false });

  return {
    data: (data as SkillSnapshot[]) ?? [],
    error: error ? error.message : null,
  };
}

/**
 * Fetch the two most-recent weeks of snapshots for every skill.
 * Used on the Weekly movers page to calculate week-over-week change.
 */
export async function fetchWeeklyMoversData(): Promise<{
  data: SkillSnapshot[];
  error: string | null;
}> {
  // Get the 2 most-recent distinct (year, week_number) combos
  const { data: weeks, error: weeksError } = await supabase
    .from("skill_snapshots")
    .select("year, week_number")
    .order("year",        { ascending: false })
    .order("week_number", { ascending: false })
    .limit(2);

  if (weeksError || !weeks || weeks.length === 0) {
    return { data: [], error: weeksError?.message ?? null };
  }

  // Fetch all rows for those weeks
  const conditions = weeks.map(
    (w: { year: number; week_number: number }) =>
      `(year.eq.${w.year},week_number.eq.${w.week_number})`
  );

  const { data, error } = await supabase
    .from("skill_snapshots")
    .select("*")
    .or(conditions.join(","));

  return {
    data: (data as SkillSnapshot[]) ?? [],
    error: error ? error.message : null,
  };
}

/**
 * Fetch all snapshots for multiple skills.
 * Used on the Compare page.
 */
export async function fetchSkillsSnapshots(
  skillNames: string[]
): Promise<{ data: SkillSnapshot[]; error: string | null }> {
  if (skillNames.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from("skill_snapshots")
    .select("*")
    .in("skill_name", skillNames)
    .order("recorded_at", { ascending: true });

  return {
    data: (data as SkillSnapshot[]) ?? [],
    error: error ? error.message : null,
  };
}
