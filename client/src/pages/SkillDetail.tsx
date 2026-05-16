import { useMemo, useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import TrendChart from "@/components/TrendChart";
import SkillCard from "@/components/SkillCard";
import { getSkillBySlug, getSkillsByCategory, SKILLS } from "@/lib/skillsConfig";
import { calcPercentChange } from "@/lib/dataUtils";
import { fetchSkillSnapshots, fetchSkillsSnapshots } from "@/lib/supabase";
import type { SkillSnapshot } from "@/lib/supabase";

export default function SkillDetail() {
  const params = useParams<{ name: string }>();
  const skillSlug = params.name;
  const skill = getSkillBySlug(skillSlug || "");

  const [snapshots, setSnapshots] = useState<SkillSnapshot[]>([]);
  const [relatedSnapshots, setRelatedSnapshots] = useState<SkillSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skill) return;

    async function loadData() {
      setLoading(true);

      // Fetch history for this skill
      const { data } = await fetchSkillSnapshots(skill!.name);
      setSnapshots(data);

      // Fetch latest snapshot for related skills in same category
      const related = getSkillsByCategory(skill!.category)
        .filter((s) => s.slug !== skill!.slug)
        .slice(0, 5)
        .map((s) => s.name);

      const { data: relData } = await fetchSkillsSnapshots(related);
      setRelatedSnapshots(relData);

      setLoading(false);
    }

    loadData();
  }, [skill]);

  const skillData = useMemo(() => {
    if (snapshots.length === 0) return null;

    const sorted = [...snapshots].sort(
      (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    );

    const chartData = sorted.map((s, i) => ({
      week: `W${i + 1}`,
      count: s.job_count,
      weekNumber: s.week_number,
    }));

    const currentCount = sorted[sorted.length - 1].job_count;
    const previousCount = sorted.length > 1 ? sorted[sorted.length - 2].job_count : currentCount;
    const percentChange = calcPercentChange(currentCount, previousCount);
    const maxCount = Math.max(...sorted.map((s) => s.job_count));
    const minCount = Math.min(...sorted.map((s) => s.job_count));
    const trend =
      sorted[sorted.length - 1].job_count > sorted[0].job_count
        ? "Growing"
        : sorted[sorted.length - 1].job_count < sorted[0].job_count
          ? "Declining"
          : "Stable";

    return { currentCount, percentChange, maxCount, minCount, trend, chartData };
  }, [snapshots]);

  // Build related skill cards (latest snapshot per related skill)
  const relatedSkillCards = useMemo(() => {
    const latestBySkill: Record<string, SkillSnapshot> = {};
    relatedSnapshots.forEach((s) => {
      if (
        !latestBySkill[s.skill_name] ||
        new Date(s.recorded_at) > new Date(latestBySkill[s.skill_name].recorded_at)
      ) {
        latestBySkill[s.skill_name] = s;
      }
    });

    return Object.values(latestBySkill).map((s) => ({
      name: s.skill_name,
      category: s.category,
      jobCount: s.job_count,
      percentChange: 0,
      sparklineData: [s.job_count],
      slug: s.skill_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }));
  }, [relatedSnapshots]);

  const formatNumber = (num: number) => new Intl.NumberFormat("en-IN").format(num);

  if (!skill) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
        <span style={{ color: "#A8A29E" }}>Skill not found</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", backgroundColor: "#FAFAF8", flexDirection: "column", gap: "12px" }}>
        <div style={{ width: "24px", height: "24px", border: "2px solid #E8E4DC", borderTopColor: "#78716C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ color: "#A8A29E", fontSize: "13px" }}>Loading live data…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!skillData) {
    return (
      <div style={{ backgroundColor: "#FAFAF8", color: "#1C1917", minHeight: "100vh" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
          <Link href="/"><a style={{ fontSize: "13px", color: "#78716C", textDecoration: "none" }}>Dashboard</a></Link>
          <span style={{ color: "#A8A29E", margin: "0 8px" }}>/</span>
          <span style={{ fontSize: "13px", color: "#78716C" }}>{skill.name}</span>
          <div style={{ marginTop: "32px", borderLeft: "2px solid #D97706", paddingLeft: "16px", paddingTop: "12px", paddingBottom: "12px" }}>
            <p style={{ fontSize: "15px", color: "#78716C", margin: 0 }}>
              No data yet for <strong>{skill.name}</strong>. The first snapshot runs Monday at 6AM IST!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FAFAF8", color: "#1C1917", minHeight: "100vh" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: "32px" }}>
          <Link href="/">
            <a style={{ fontSize: "13px", color: "#78716C", textDecoration: "none" }} className="hover:text-foreground">
              Dashboard
            </a>
          </Link>
          <span style={{ color: "#A8A29E", margin: "0 8px" }}>/</span>
          <span style={{ fontSize: "13px", color: "#78716C" }}>{skill.name}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 600, color: "#1C1917", margin: 0 }}>{skill.name}</h1>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {skill.category}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
            <div style={{ fontSize: "48px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "#1C1917", fontVariantNumeric: "tabular-nums" }}>
              {formatNumber(skillData.currentCount)}
            </div>
            <span style={{ fontSize: "14px", color: "#78716C" }}>job listings this week</span>
          </div>

          {skillData.percentChange !== 0 && (
            <div style={{ fontSize: "14px", fontWeight: 600, color: skillData.percentChange > 0 ? "#16A34A" : "#DC2626" }}>
              {skillData.percentChange > 0 ? "+" : ""}{skillData.percentChange.toFixed(1)}% from last week
            </div>
          )}
        </div>

        {/* Stats Strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "32px", borderTop: "1px solid #E8E4DC", borderBottom: "1px solid #E8E4DC", padding: "16px 0" }}>
          <div style={{ flex: 1, padding: "0 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Peak Week</div>
            <div style={{ fontSize: "20px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: "#1C1917", fontVariantNumeric: "tabular-nums" }}>
              {formatNumber(skillData.maxCount)}
            </div>
          </div>
          <div style={{ width: "1px", height: "48px", backgroundColor: "#E8E4DC" }} />

          <div style={{ flex: 1, padding: "0 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Lowest Week</div>
            <div style={{ fontSize: "20px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: "#1C1917", fontVariantNumeric: "tabular-nums" }}>
              {formatNumber(skillData.minCount)}
            </div>
          </div>
          <div style={{ width: "1px", height: "48px", backgroundColor: "#E8E4DC" }} />

          <div style={{ flex: 1, padding: "0 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Weeks Tracked</div>
            <div style={{ fontSize: "20px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: "#1C1917", fontVariantNumeric: "tabular-nums" }}>
              {snapshots.length}
            </div>
          </div>
          <div style={{ width: "1px", height: "48px", backgroundColor: "#E8E4DC" }} />

          <div style={{ flex: 1, padding: "0 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Trend</div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#D97706" }}>{skillData.trend}</div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ marginBottom: "32px" }}>
          <TrendChart data={skillData.chartData} skillName={skill.name} />
        </div>

        {/* Related Skills */}
        {relatedSkillCards.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "11px", fontWeight: 600, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
              Also tracked in {skill.category}
            </h2>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "16px" }}>
              {relatedSkillCards.map((relatedSkill) => (
                <div key={relatedSkill.slug} style={{ flex: "0 0 144px" }}>
                  <SkillCard
                    name={relatedSkill.name}
                    category={relatedSkill.category}
                    jobCount={relatedSkill.jobCount}
                    percentChange={relatedSkill.percentChange}
                    sparklineData={relatedSkill.sparklineData}
                    slug={relatedSkill.slug}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
