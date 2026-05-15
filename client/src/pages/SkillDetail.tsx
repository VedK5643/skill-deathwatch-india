import { useMemo } from "react";
import { useParams, Link } from "wouter";
import TrendChart from "@/components/TrendChart";
import SkillCard from "@/components/SkillCard";
import { SKILLS, getSkillBySlug, getSkillsByCategory } from "@/lib/skillsConfig";
import { calcPercentChange, getSparklineData } from "@/lib/dataUtils";

interface SkillDataWithTrend {
  name: string;
  category: string;
  jobCount: number;
  percentChange: number;
  sparklineData: number[];
  slug: string;
}

export default function SkillDetail() {
  const params = useParams<{ name: string }>();
  const skillSlug = params.name;

  const skill = getSkillBySlug(skillSlug || "");

  // Mock data for the skill
  const mockData = useMemo(() => {
    if (!skill) return null;

    const baseCount = Math.floor(Math.random() * 5000) + 1000;
    const sparklineData = Array.from({ length: 52 }, () =>
      Math.floor(baseCount + (Math.random() - 0.5) * 1000)
    );

    // Generate chart data
    const chartData = sparklineData.map((count, index) => ({
      week: `W${index + 1}`,
      count,
      weekNumber: index + 1,
    }));

    const currentCount = sparklineData[sparklineData.length - 1];
    const previousCount = sparklineData[sparklineData.length - 2];
    const percentChange = calcPercentChange(currentCount, previousCount);

    // Calculate stats
    const maxCount = Math.max(...sparklineData);
    const minCount = Math.min(...sparklineData);
    const trend =
      sparklineData[sparklineData.length - 1] > sparklineData[0]
        ? "Growing"
        : sparklineData[sparklineData.length - 1] < sparklineData[0]
          ? "Declining"
          : "Stable";

    return {
      currentCount,
      percentChange,
      maxCount,
      minCount,
      trend,
      chartData,
      sparklineData: sparklineData.slice(-8),
    };
  }, [skill]);

  // Mock related skills
  const relatedSkills = useMemo(() => {
    if (!skill) return [];
    const categorySkills = getSkillsByCategory(skill.category);
    return categorySkills
      .filter((s) => s.slug !== skill.slug)
      .slice(0, 5)
      .map((s) => {
        const baseCount = Math.floor(Math.random() * 5000) + 1000;
        const sparklineData = Array.from({ length: 8 }, () =>
          Math.floor(baseCount + (Math.random() - 0.5) * 1000)
        );
        const currentCount = sparklineData[sparklineData.length - 1];
        const previousCount = sparklineData[sparklineData.length - 2];
        const percentChange = calcPercentChange(currentCount, previousCount);

        return {
          name: s.name,
          category: s.category,
          jobCount: currentCount,
          percentChange,
          sparklineData,
          slug: s.slug,
        };
      });
  }, [skill]);

  if (!skill || !mockData) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#FAFAF8",
        }}
      >
        <span style={{ color: "#A8A29E" }}>Skill not found</span>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <div style={{ backgroundColor: "#FAFAF8", color: "#1C1917", minHeight: "100vh" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: "32px" }}>
          <Link href="/">
            <a
              style={{
                fontSize: "13px",
                color: "#78716C",
                textDecoration: "none",
                transition: "color 200ms",
              }}
              className="hover:text-foreground"
            >
              Dashboard
            </a>
          </Link>
          <span style={{ color: "#A8A29E", margin: "0 8px" }}>/</span>
          <span style={{ fontSize: "13px", color: "#78716C" }}>{skill.name}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 600, color: "#1C1917", margin: 0 }}>
              {skill.name}
            </h1>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {skill.category}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                color: "#1C1917",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatNumber(mockData.currentCount)}
            </div>
            <span style={{ fontSize: "14px", color: "#78716C" }}>job listings this week</span>
          </div>

          {mockData.percentChange !== 0 && (
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color:
                  mockData.percentChange > 0 ? "#16A34A" : "#DC2626",
              }}
            >
              {mockData.percentChange > 0 ? "+" : ""}
              {mockData.percentChange.toFixed(1)}% from last week
            </div>
          )}
        </div>

        {/* Stats Strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            marginBottom: "32px",
            borderTop: "1px solid #E8E4DC",
            borderBottom: "1px solid #E8E4DC",
            padding: "16px 0",
          }}
        >
          <div style={{ flex: 1, padding: "0 16px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "8px",
              }}
            >
              Peak Week
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                color: "#1C1917",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatNumber(mockData.maxCount)}
            </div>
          </div>
          <div style={{ width: "1px", height: "48px", backgroundColor: "#E8E4DC" }}></div>

          <div style={{ flex: 1, padding: "0 16px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "8px",
              }}
            >
              Lowest Week
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                color: "#1C1917",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatNumber(mockData.minCount)}
            </div>
          </div>
          <div style={{ width: "1px", height: "48px", backgroundColor: "#E8E4DC" }}></div>

          <div style={{ flex: 1, padding: "0 16px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "8px",
              }}
            >
              Current Count
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                color: "#1C1917",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatNumber(mockData.currentCount)}
            </div>
          </div>
          <div style={{ width: "1px", height: "48px", backgroundColor: "#E8E4DC" }}></div>

          <div style={{ flex: 1, padding: "0 16px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "8px",
              }}
            >
              12-Week Trend
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#D97706",
              }}
            >
              {mockData.trend}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ marginBottom: "32px" }}>
          <TrendChart data={mockData.chartData} skillName={skill.name} />
        </div>

        {/* Related Skills */}
        {relatedSkills.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "16px",
              }}
            >
              Also tracked in {skill.category}
            </h2>
            <div
              style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "16px",
              }}
            >
              {relatedSkills.map((relatedSkill) => (
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
