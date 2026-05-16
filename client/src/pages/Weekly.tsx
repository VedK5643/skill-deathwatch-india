import { useMemo, useEffect, useState } from "react";
import { Link } from "wouter";
import { fetchWeeklyMoversData } from "@/lib/supabase";
import { calcPercentChange } from "@/lib/dataUtils";
import type { SkillSnapshot } from "@/lib/supabase";

interface SkillWithChange {
  name: string;
  category: string;
  jobCount: number;
  percentChange: number;
  slug: string;
}

export default function Weekly() {
  const [snapshots, setSnapshots] = useState<SkillSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data, error } = await fetchWeeklyMoversData();
      if (error) console.error("[Weekly] Supabase error:", error);
      setSnapshots(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const weeklyData = useMemo(() => {
    if (snapshots.length === 0) return { rising: [], falling: [], surprise: null };

    // Group by skill name
    const groups: Record<string, SkillSnapshot[]> = {};
    snapshots.forEach((s) => {
      if (!groups[s.skill_name]) groups[s.skill_name] = [];
      groups[s.skill_name].push(s);
    });

    // Calculate week-over-week change for skills with 2 weeks of data
    const changes: SkillWithChange[] = [];
    Object.entries(groups).forEach(([, snaps]) => {
      const sorted = [...snaps].sort(
        (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
      );
      const latest = sorted[0];
      const previous = sorted[1];
      const percentChange = previous
        ? calcPercentChange(latest.job_count, previous.job_count)
        : 0;

      changes.push({
        name: latest.skill_name,
        category: latest.category,
        jobCount: latest.job_count,
        percentChange,
        slug: latest.skill_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      });
    });

    changes.sort((a, b) => b.percentChange - a.percentChange);

    const rising = changes.filter((s) => s.percentChange > 0).slice(0, 3);
    const falling = changes
      .filter((s) => s.percentChange < 0)
      .sort((a, b) => a.percentChange - b.percentChange)
      .slice(0, 3);

    const surprise =
      changes.length > 0
        ? changes.reduce((max, current) =>
            Math.abs(current.percentChange) > Math.abs(max.percentChange) ? current : max
          )
        : null;

    return { rising, falling, surprise };
  }, [snapshots]);

  const formatNumber = (num: number) => new Intl.NumberFormat("en-IN").format(num);
  const formatPercent = (num: number) => {
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(1)}%`;
  };

  const today = new Date();
  const weekNumber = Math.ceil(
    (today.getDate() + new Date(today.getFullYear(), today.getMonth(), 1).getDay()) / 7
  );
  const year = today.getFullYear();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "12px",
          backgroundColor: "#FAFAF8",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            border: "2px solid #E8E4DC",
            borderTopColor: "#78716C",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ color: "#A8A29E", fontSize: "13px" }}>Loading live data…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not enough data yet (need at least 2 weeks for movers)
  if (weeklyData.rising.length === 0 && weeklyData.falling.length === 0) {
    return (
      <div style={{ backgroundColor: "#FAFAF8", color: "#1C1917", minHeight: "100vh" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Week {weekNumber} · {year}
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1C1917", margin: 0 }}>
              This week's biggest movers.
            </h1>
          </div>
          <div
            style={{
              borderLeft: "2px solid #D97706",
              paddingLeft: "16px",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            <p style={{ fontSize: "15px", color: "#78716C", margin: 0, lineHeight: "1.6" }}>
              Week-over-week comparisons will appear after the second Monday snapshot runs.
              Check back next Monday after 6AM IST!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FAFAF8", color: "#1C1917", minHeight: "100vh" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#A8A29E",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
          >
            Week {weekNumber} · {year}
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1C1917", marginBottom: "16px", margin: 0 }}>
            This week's biggest movers.
          </h1>
          <p style={{ fontSize: "13px", color: "#A8A29E", margin: 0 }}>
            India job market · Live from Supabase
          </p>
        </div>

        {/* Rising Section */}
        {weeklyData.rising.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#16A34A" }} />
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#16A34A",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: 0,
                }}
              >
                Rising
              </h2>
            </div>

            <div style={{ backgroundColor: "#E8E4DC", display: "flex", flexDirection: "column" }}>
              {weeklyData.rising.map((skill, index) => (
                <div
                  key={skill.slug}
                  style={{
                    backgroundColor: "#FFFFFE",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    borderBottom: index < weeklyData.rising.length - 1 ? "1px solid #E8E4DC" : "none",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#A8A29E", width: "24px", fontFamily: "'JetBrains Mono', monospace" }}>
                    {index + 1}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "#1C1917", flex: 1 }}>
                    <Link href={`/skill/${skill.slug}`}>
                      <a style={{ color: "inherit", textDecoration: "none" }}>{skill.name}</a>
                    </Link>
                  </span>
                  <span style={{ fontSize: "15px", fontFamily: "'JetBrains Mono', monospace", color: "#78716C", fontVariantNumeric: "tabular-nums" }}>
                    {formatNumber(skill.jobCount)}
                  </span>
                  <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#16A34A", fontWeight: 600, width: "64px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {formatPercent(skill.percentChange)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Falling Section */}
        {weeklyData.falling.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#DC2626" }} />
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#DC2626",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: 0,
                }}
              >
                Falling
              </h2>
            </div>

            <div style={{ backgroundColor: "#E8E4DC", display: "flex", flexDirection: "column" }}>
              {weeklyData.falling.map((skill, index) => (
                <div
                  key={skill.slug}
                  style={{
                    backgroundColor: "#FFFFFE",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    borderBottom: index < weeklyData.falling.length - 1 ? "1px solid #E8E4DC" : "none",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#A8A29E", width: "24px", fontFamily: "'JetBrains Mono', monospace" }}>
                    {index + 1}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "#1C1917", flex: 1 }}>
                    <Link href={`/skill/${skill.slug}`}>
                      <a style={{ color: "inherit", textDecoration: "none" }}>{skill.name}</a>
                    </Link>
                  </span>
                  <span style={{ fontSize: "15px", fontFamily: "'JetBrains Mono', monospace", color: "#78716C", fontVariantNumeric: "tabular-nums" }}>
                    {formatNumber(skill.jobCount)}
                  </span>
                  <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#DC2626", fontWeight: 600, width: "64px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {formatPercent(skill.percentChange)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Surprise Box */}
        {weeklyData.surprise && weeklyData.surprise.percentChange !== 0 && (
          <div
            style={{
              borderLeft: "2px solid #D97706",
              paddingLeft: "16px",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#A8A29E", marginBottom: "8px" }}>
              This week's surprise
            </div>
            <p style={{ fontSize: "15px", color: "#1C1917", margin: 0, lineHeight: "1.6" }}>
              <span style={{ fontWeight: 600 }}>{weeklyData.surprise.name}</span> changed{" "}
              <span
                style={{
                  color: weeklyData.surprise.percentChange > 0 ? "#16A34A" : "#DC2626",
                  fontWeight: 600,
                }}
              >
                {formatPercent(weeklyData.surprise.percentChange)}
              </span>
              {" — "}
              <span style={{ color: "#78716C" }}>
                the largest single-week{" "}
                {weeklyData.surprise.percentChange > 0 ? "gain" : "decline"} this period.
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
