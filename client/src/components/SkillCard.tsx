import { Link } from "wouter";
import SparkLine from "./SparkLine";

interface SkillCardProps {
  name: string;
  category: string;
  jobCount: number;
  percentChange: number;
  sparklineData: number[];
  slug: string;
}

// Category badge color mapping
const categoryBadgeColors: { [key: string]: { bg: string; text: string } } = {
  "Programming Languages": { bg: "#FEF3C7", text: "#92400E" },
  "Frontend": { bg: "#EDE9FE", text: "#4C1D95" },
  "Backend": { bg: "#DBEAFE", text: "#1E3A8A" },
  "Data & Analytics": { bg: "#D1FAE5", text: "#064E3B" },
  "Cloud & DevOps": { bg: "#FFE4E6", text: "#9F1239" },
  "Testing & QA": { bg: "#F0FDF4", text: "#14532D" },
  "Mobile": { bg: "#FEE2E2", text: "#7F1D1D" },
};

export default function SkillCard({
  name,
  category,
  jobCount,
  percentChange,
  sparklineData,
  slug,
}: SkillCardProps) {
  const trend = percentChange > 0 ? "up" : percentChange < 0 ? "down" : "flat";
  const trendColor =
    percentChange > 0
      ? "#16A34A"
      : percentChange < 0
        ? "#DC2626"
        : "#A8A29E";

  const badgeStyle = categoryBadgeColors[category] || {
    bg: "#F0EDE6",
    text: "#78716C",
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const formatPercent = (num: number) => {
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(1)}%`;
  };

  return (
    <Link href={`/skill/${slug}`}>
      <div
        className="skill-card no-underline block"
        style={{
          backgroundColor: "#FFFFFE",
          padding: "16px",
          cursor: "pointer",
          transition: "background-color 200ms",
          display: "block",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#F5F3EE";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#FFFFFE";
        }}
      >
        {/* Row 1: Category Badge + Percent Change */}
        <div className="flex justify-between items-start mb-3">
          <span
            style={{
              fontSize: "9px",
              fontWeight: 600,
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.text,
              padding: "2px 7px",
              borderRadius: "4px",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            {category}
          </span>
          {percentChange !== 0 && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                color: trendColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatPercent(percentChange)}
            </span>
          )}
        </div>

        {/* Row 2: Skill Name */}
        <div className="mb-2">
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1C1917",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {name}
          </span>
        </div>

        {/* Row 3: Job Count */}
        <div className="mb-3">
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              color: "#1C1917",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.5px",
            }}
          >
            {formatNumber(jobCount)}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#A8A29E",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            jobs
          </div>
        </div>

        {/* Row 4: SparkLine */}
        <SparkLine data={sparklineData} trend={trend} />
      </div>
    </Link>
  );
}
