import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import CompareChart from "@/components/CompareChart";
import { SKILLS } from "@/lib/skillsConfig";
import { calcPercentChange } from "@/lib/dataUtils";

interface SkillDataWithTrend {
  name: string;
  category: string;
  jobCount: number;
  percentChange: number;
  sparklineData: number[];
  slug: string;
}

export default function Compare() {
  const [, setLocation] = useLocation();
  const [skillASlug, setSkillASlug] = useState<string>("");
  const [skillBSlug, setSkillBSlug] = useState<string>("");
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [isOpenA, setIsOpenA] = useState(false);
  const [isOpenB, setIsOpenB] = useState(false);

  // Mock data generation
  const getMockSkillData = (slug: string): SkillDataWithTrend | null => {
    const skill = SKILLS.find((s) => s.slug === slug);
    if (!skill) return null;

    const baseCount = Math.floor(Math.random() * 5000) + 1000;
    const sparklineData = Array.from({ length: 52 }, () =>
      Math.floor(baseCount + (Math.random() - 0.5) * 1000)
    );

    const currentCount = sparklineData[sparklineData.length - 1];
    const previousCount = sparklineData[sparklineData.length - 2];
    const percentChange = calcPercentChange(currentCount, previousCount);

    return {
      name: skill.name,
      category: skill.category,
      jobCount: currentCount,
      percentChange,
      sparklineData,
      slug: skill.slug,
    };
  };

  const skillA = skillASlug ? getMockSkillData(skillASlug) : null;
  const skillB = skillBSlug ? getMockSkillData(skillBSlug) : null;

  // Generate chart data
  const chartData = useMemo(() => {
    if (!skillA || !skillB) return [];

    return Array.from({ length: 52 }, (_, i) => ({
      week: `W${i + 1}`,
      skillA: skillA.sparklineData[i % skillA.sparklineData.length],
      skillB: skillB.sparklineData[i % skillB.sparklineData.length],
    }));
  }, [skillA, skillB]);

  // Filter skills based on search
  const filteredSkills = (search: string) => {
    if (!search) return SKILLS;
    return SKILLS.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/compare?a=${skillASlug}&b=${skillBSlug}`;
    navigator.clipboard.writeText(url);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const formatPercent = (num: number) => {
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(1)}%`;
  };

  return (
    <div style={{ backgroundColor: "#FAFAF8", color: "#1C1917", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 600, color: "#1C1917", marginBottom: "8px", margin: 0 }}>
              Compare Skills
            </h1>
            <p style={{ fontSize: "14px", color: "#A8A29E", margin: 0 }}>
              Head-to-head job market comparison
            </p>
          </div>
          {skillA && skillB && (
            <button
              onClick={handleCopyLink}
              style={{
                padding: "8px 16px",
                border: "1px solid #E8E4DC",
                fontSize: "13px",
                color: "#A8A29E",
                backgroundColor: "#FFFFFE",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 200ms",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.color = "#1C1917";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.color = "#A8A29E";
              }}
            >
              Copy link
            </button>
          )}
        </div>

        {/* Skill Selectors */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Skill A */}
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#A8A29E",
                textTransform: "uppercase",
                marginBottom: "8px",
                display: "block",
                letterSpacing: "0.07em",
              }}
            >
              Skill A
            </label>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setIsOpenA(!isOpenA);
                  setIsOpenB(false);
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #E8E4DC",
                  backgroundColor: "#FFFFFE",
                  color: "#1C1917",
                  fontSize: "13px",
                  textAlign: "left",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 200ms",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#F5F3EE";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#FFFFFE";
                }}
              >
                <span>{skillA?.name || "Select a skill"}</span>
                <svg
                  style={{
                    width: "16px",
                    height: "16px",
                    transition: "transform 200ms",
                    transform: isOpenA ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {isOpenA && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "4px",
                    backgroundColor: "#FFFFFE",
                    border: "1px solid #E8E4DC",
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 10,
                    maxHeight: "256px",
                    overflowY: "auto",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchA}
                    onChange={(e) => setSearchA(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#F5F3EE",
                      border: "1px solid #E8E4DC",
                      fontSize: "13px",
                      color: "#1C1917",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                  {filteredSkills(searchA).map((skill) => (
                    <button
                      key={skill.slug}
                      onClick={() => {
                        setSkillASlug(skill.slug);
                        setIsOpenA(false);
                        setSearchA("");
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        fontSize: "13px",
                        color: "#78716C",
                        backgroundColor: "#FFFFFE",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 200ms",
                        fontFamily: "'Inter', sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#F5F3EE";
                        (e.target as HTMLButtonElement).style.color = "#1C1917";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#FFFFFE";
                        (e.target as HTMLButtonElement).style.color = "#78716C";
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{skill.name}</div>
                      <div style={{ fontSize: "11px", color: "#A8A29E" }}>{skill.category}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skill B */}
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#A8A29E",
                textTransform: "uppercase",
                marginBottom: "8px",
                display: "block",
                letterSpacing: "0.07em",
              }}
            >
              Skill B
            </label>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setIsOpenB(!isOpenB);
                  setIsOpenA(false);
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #E8E4DC",
                  backgroundColor: "#FFFFFE",
                  color: "#1C1917",
                  fontSize: "13px",
                  textAlign: "left",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 200ms",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#F5F3EE";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#FFFFFE";
                }}
              >
                <span>{skillB?.name || "Select a skill"}</span>
                <svg
                  style={{
                    width: "16px",
                    height: "16px",
                    transition: "transform 200ms",
                    transform: isOpenB ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {isOpenB && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "4px",
                    backgroundColor: "#FFFFFE",
                    border: "1px solid #E8E4DC",
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 10,
                    maxHeight: "256px",
                    overflowY: "auto",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchB}
                    onChange={(e) => setSearchB(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#F5F3EE",
                      border: "1px solid #E8E4DC",
                      fontSize: "13px",
                      color: "#1C1917",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                  {filteredSkills(searchB).map((skill) => (
                    <button
                      key={skill.slug}
                      onClick={() => {
                        setSkillBSlug(skill.slug);
                        setIsOpenB(false);
                        setSearchB("");
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        fontSize: "13px",
                        color: "#78716C",
                        backgroundColor: "#FFFFFE",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 200ms",
                        fontFamily: "'Inter', sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#F5F3EE";
                        (e.target as HTMLButtonElement).style.color = "#1C1917";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#FFFFFE";
                        (e.target as HTMLButtonElement).style.color = "#78716C";
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{skill.name}</div>
                      <div style={{ fontSize: "11px", color: "#A8A29E" }}>{skill.category}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!skillA || !skillB ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 24px",
              backgroundColor: "#FFFFFE",
              border: "1px solid #E8E4DC",
              borderRadius: "4px",
            }}
          >
            <span style={{ color: "#A8A29E" }}>Select two skills to compare.</span>
          </div>
        ) : (
          <>
            {/* Chart */}
            <div style={{ marginBottom: "32px" }}>
              <CompareChart
                data={chartData}
                skillAName={skillA.name}
                skillBName={skillB.name}
              />
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Skill A Stats */}
              <div
                style={{
                  border: "1px solid #E8E4DC",
                  borderRadius: "4px",
                  padding: "16px",
                }}
              >
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1C1917", marginBottom: "16px", margin: 0 }}>
                  {skillA.name}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#A8A29E" }}>Current Jobs</span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#1C1917",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatNumber(skillA.jobCount)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#A8A29E" }}>Peak</span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#1C1917",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatNumber(Math.max(...skillA.sparklineData))}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#A8A29E" }}>12-Week Trend</span>
                    <span style={{ fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "#D97706" }}>
                      Growing
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#A8A29E" }}>% Change</span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: skillA.percentChange > 0 ? "#16A34A" : "#DC2626",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatPercent(skillA.percentChange)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skill B Stats */}
              <div
                style={{
                  border: "1px solid #E8E4DC",
                  borderRadius: "4px",
                  padding: "16px",
                }}
              >
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1C1917", marginBottom: "16px", margin: 0 }}>
                  {skillB.name}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#A8A29E" }}>Current Jobs</span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#1C1917",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatNumber(skillB.jobCount)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#A8A29E" }}>Peak</span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#1C1917",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatNumber(Math.max(...skillB.sparklineData))}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#A8A29E" }}>12-Week Trend</span>
                    <span style={{ fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "#D97706" }}>
                      Growing
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#A8A29E" }}>% Change</span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: skillB.percentChange > 0 ? "#16A34A" : "#DC2626",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatPercent(skillB.percentChange)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
