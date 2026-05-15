import { useState, useMemo } from "react";
import SkillCard from "@/components/SkillCard";
import SortFilterBar from "@/components/SortFilterBar";
import { SKILLS, CATEGORIES } from "@/lib/skillsConfig";
import { calcPercentChange, getSparklineData, getTrendDirection } from "@/lib/dataUtils";

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

  // Mock data generation - in production, this would come from Supabase
  const mockSkillsData: SkillDataWithTrend[] = useMemo(() => {
    return SKILLS.map((skill) => {
      // Generate mock sparkline data (8 weeks)
      const baseCount = Math.floor(Math.random() * 5000) + 1000;
      const sparklineData = Array.from({ length: 8 }, () =>
        Math.floor(baseCount + (Math.random() - 0.5) * 1000)
      );

      // Calculate percent change
      const previousCount = sparklineData[sparklineData.length - 2] || baseCount;
      const currentCount = sparklineData[sparklineData.length - 1] || baseCount;
      const percentChange = calcPercentChange(currentCount, previousCount);

      return {
        name: skill.name,
        category: skill.category,
        jobCount: currentCount,
        percentChange,
        sparklineData,
        slug: skill.slug,
      };
    });
  }, []);

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    let filtered = mockSkillsData;

    if (selectedCategory) {
      filtered = filtered.filter((skill) => skill.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "jobs") {
      sorted.sort((a, b) => b.jobCount - a.jobCount);
    } else if (sortBy === "change") {
      sorted.sort((a, b) => b.percentChange - a.percentChange);
    }

    return sorted;
  }, [mockSkillsData, selectedCategory, sortBy]);

  return (
    <div style={{ backgroundColor: "#FAFAF8", color: "#1C1917", minHeight: "100vh" }}>
      <SortFilterBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Skill Grid */}
      <div style={{ padding: "24px" }}>
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
            />
          ))}
        </div>

        {filteredAndSorted.length === 0 && (
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
