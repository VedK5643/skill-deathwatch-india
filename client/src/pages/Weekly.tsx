import { useMemo } from "react";
import { SKILLS } from "@/lib/skillsConfig";
import { calcPercentChange } from "@/lib/dataUtils";

interface SkillWithChange {
  name: string;
  category: string;
  jobCount: number;
  percentChange: number;
  slug: string;
}

export default function Weekly() {
  // Mock data generation
  const weeklyData = useMemo(() => {
    const skillsWithChange: SkillWithChange[] = SKILLS.map((skill) => {
      const previousCount = Math.floor(Math.random() * 5000) + 1000;
      const currentCount = Math.floor(previousCount + (Math.random() - 0.5) * 1000);
      const percentChange = calcPercentChange(currentCount, previousCount);

      return {
        name: skill.name,
        category: skill.category,
        jobCount: currentCount,
        percentChange,
        slug: skill.slug,
      };
    });

    // Sort by percent change
    skillsWithChange.sort((a, b) => b.percentChange - a.percentChange);

    const rising = skillsWithChange.filter((s) => s.percentChange > 0).slice(0, 3);
    const falling = skillsWithChange
      .filter((s) => s.percentChange < 0)
      .sort((a, b) => a.percentChange - b.percentChange)
      .slice(0, 3);

    const surprise = skillsWithChange.reduce((max, current) => {
      const currentAbs = Math.abs(current.percentChange);
      const maxAbs = Math.abs(max.percentChange);
      return currentAbs > maxAbs ? current : max;
    });

    return { rising, falling, surprise };
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const formatPercent = (num: number) => {
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(1)}%`;
  };

  const today = new Date();
  const weekNumber = Math.ceil((today.getDate() + new Date(today.getFullYear(), today.getMonth(), 1).getDay()) / 7);
  const year = today.getFullYear();

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
            India job market · Updated 12 May
          </p>
        </div>

        {/* Rising Section */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#16A34A",
              }}
            ></div>
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
                <span
                  style={{
                    fontSize: "12px",
                    color: "#A8A29E",
                    width: "24px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {index + 1}
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1C1917",
                    fontFamily: "'Inter', sans-serif",
                    flex: 1,
                  }}
                >
                  {skill.name}
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#78716C",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatNumber(skill.jobCount)}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#16A34A",
                    fontWeight: 600,
                    width: "64px",
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatPercent(skill.percentChange)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Falling Section */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#DC2626",
              }}
            ></div>
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
                <span
                  style={{
                    fontSize: "12px",
                    color: "#A8A29E",
                    width: "24px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {index + 1}
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1C1917",
                    fontFamily: "'Inter', sans-serif",
                    flex: 1,
                  }}
                >
                  {skill.name}
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#78716C",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatNumber(skill.jobCount)}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#DC2626",
                    fontWeight: 600,
                    width: "64px",
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatPercent(skill.percentChange)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Surprise Box */}
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
                color:
                  weeklyData.surprise.percentChange > 0
                    ? "#16A34A"
                    : "#DC2626",
                fontWeight: 600,
              }}
            >
              {formatPercent(weeklyData.surprise.percentChange)}
            </span>
            {" — "}
            <span style={{ color: "#78716C" }}>
              the largest single-week{" "}
              {weeklyData.surprise.percentChange > 0 ? "gain" : "decline"} in 3 months.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
