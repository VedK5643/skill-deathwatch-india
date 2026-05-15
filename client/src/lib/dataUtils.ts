export interface SkillSnapshot {
  skill_name: string;
  category: string;
  job_count: number;
  recorded_at: string;
  week_number: number;
  year: number;
}

export interface SkillData {
  name: string;
  category: string;
  jobCount: number;
  percentChange: number;
  sparklineData: number[];
  slug: string;
}

/**
 * Calculate percent change between two values
 */
export function calcPercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get the latest snapshot for a skill
 */
export function getLatestSnapshot(
  snapshots: SkillSnapshot[]
): SkillSnapshot | null {
  if (snapshots.length === 0) return null;
  return snapshots.reduce((latest, current) => {
    const latestDate = new Date(latest.recorded_at);
    const currentDate = new Date(current.recorded_at);
    return currentDate > latestDate ? current : latest;
  });
}

/**
 * Get the previous week's snapshot for a skill
 */
export function getPreviousWeekSnapshot(
  snapshots: SkillSnapshot[]
): SkillSnapshot | null {
  if (snapshots.length < 2) return null;
  
  // Sort by date descending
  const sorted = [...snapshots].sort(
    (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
  );
  
  return sorted[1] || null;
}

/**
 * Get the last N snapshots for sparkline data
 */
export function getSparklineData(snapshots: SkillSnapshot[], count: number = 8): number[] {
  const sorted = [...snapshots]
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    .slice(-count);
  
  return sorted.map((s) => s.job_count);
}

/**
 * Get week-over-week movers (rising and falling skills)
 */
export function getWeekOverWeekMovers(
  snapshots: SkillSnapshot[]
): {
  rising: Array<SkillSnapshot & { percentChange: number }>;
  falling: Array<SkillSnapshot & { percentChange: number }>;
  surprise: (SkillSnapshot & { percentChange: number }) | null;
} {
  // Group by skill name
  const skillGroups: { [key: string]: SkillSnapshot[] } = {};
  
  snapshots.forEach((snapshot) => {
    if (!skillGroups[snapshot.skill_name]) {
      skillGroups[snapshot.skill_name] = [];
    }
    skillGroups[snapshot.skill_name].push(snapshot);
  });

  // Calculate percent change for each skill
  const changes: Array<SkillSnapshot & { percentChange: number }> = [];
  
  Object.entries(skillGroups).forEach(([, snaps]) => {
    const sorted = snaps.sort(
      (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
    );
    
    if (sorted.length >= 2) {
      const latest = sorted[0];
      const previous = sorted[1];
      const percentChange = calcPercentChange(latest.job_count, previous.job_count);
      
      changes.push({
        ...latest,
        percentChange,
      });
    }
  });

  // Sort by percent change
  changes.sort((a, b) => b.percentChange - a.percentChange);

  const rising = changes.filter((c) => c.percentChange > 0).slice(0, 3);
  const falling = changes.filter((c) => c.percentChange < 0).slice(0, 3);
  const surprise = changes.reduce((max, current) => {
    const currentAbs = Math.abs(current.percentChange);
    const maxAbs = Math.abs(max.percentChange);
    return currentAbs > maxAbs ? current : max;
  });

  return { rising, falling, surprise };
}

/**
 * Group skills by category
 */
export function groupByCategory(
  skills: SkillData[]
): { [key: string]: SkillData[] } {
  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as { [key: string]: SkillData[] }
  );
}

/**
 * Format a number with Indian numbering system
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Format percent change with sign
 */
export function formatPercentChange(percent: number): string {
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}%`;
}

/**
 * Get trend direction
 */
export function getTrendDirection(percentChange: number): "up" | "down" | "flat" {
  if (percentChange > 0) return "up";
  if (percentChange < 0) return "down";
  return "flat";
}
