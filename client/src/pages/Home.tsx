import { useState, useMemo, useEffect } from "react";
import SkillCard from "@/components/SkillCard";
import SortFilterBar from "@/components/SortFilterBar";
import { fetchRecentSnapshots } from "@/lib/supabase";
import { calcPercentChange } from "@/lib/dataUtils";

const TRENDING_SKILLS = ['Python', 'JavaScript', 'AWS', 'SQL', 'React'];

interface SkillDataWithTrend {
  name: string;
  category: string;
  jobCount: number;
  percentChange: number;
  sparklineData: number[];
  slug: string;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "jobs" | "change">("jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [skillsData, setSkillsData] = useState<SkillDataWithTrend[]>([]);

  // Derive categories from actual Supabase data so they always match the filter
  const categories = useMemo(
    () => Array.from(new Set(skillsData.map((s) => s.category))).sort(),
    [skillsData]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data, error } = await fetchRecentSnapshots();
      if (error) {
        console.error("[Home] Supabase error:", error);
      }

      // Build skill cards from Supabase data
      const mapped: SkillDataWithTrend[] = data.map((snap) => ({
        name: snap.skill_name,
        category: snap.category,
        jobCount: snap.job_count,
        // We only have 1 week of data per call — no percent change yet until 2nd week
        percentChange: 0,
        sparklineData: [snap.job_count],
        slug: snap.skill_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      }));

      setSkillsData(mapped);
      setLoading(false);
    }

    loadData();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let filtered = skillsData;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((skill) => skill.category === selectedCategory);
    }

    const sorted = [...filtered];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "jobs") {
      sorted.sort((a, b) => b.jobCount - a.jobCount);
    } else if (sortBy === "change") {
      sorted.sort((a, b) => b.percentChange - a.percentChange);
    }

    return sorted;
  }, [skillsData, selectedCategory, sortBy, searchQuery]);

  return (
    <div style={{ backgroundColor: "#FAFAF8", color: "#1C1917", minHeight: "100vh" }}>
      <SortFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Skill Grid */}
      <div style={{ padding: "24px" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "80px",
              flexDirection: "column",
              gap: "12px",
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
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1px",
              backgroundColor: "#E8E4DC",
            }}
          >
            {filteredAndSorted.map((skill) => (
              <SkillCard
                key={skill.slug}
                name={skill.name}
                category={skill.category}
                jobCount={skill.jobCount}
                percentChange={skill.percentChange}
                sparklineData={skill.sparklineData}
                slug={skill.slug}
                isTrending={TRENDING_SKILLS.includes(skill.name)}
              />
            ))}
          </div>
        )}

        {!loading && filteredAndSorted.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "48px",
            }}
          >
            <span style={{ color: "#A8A29E" }}>No skills found</span>
          </div>
        )}
      </div>
    </div>
  );
}
