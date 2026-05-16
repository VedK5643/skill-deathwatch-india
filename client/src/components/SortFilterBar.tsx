import { useState } from "react";

interface SortFilterBarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortBy: "name" | "jobs" | "change";
  onSortChange: (sort: "name" | "jobs" | "change") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SortFilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}: SortFilterBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "jobs", label: "Job Count" },
    { value: "change", label: "% Change" },
  ] as const;

  return (
    <div
      style={{
        borderBottom: "1px solid #E8E4DC",
        backgroundColor: "#FFFFFE",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Category Pills */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        <button
          onClick={() => onCategoryChange(null)}
          style={{
            padding: "4px 11px",
            fontSize: "11px",
            fontWeight: 500,
            border: `1px solid ${selectedCategory === null ? "#1C1917" : "#E0DCD2"}`,
            backgroundColor: selectedCategory === null ? "#1C1917" : "transparent",
            color: selectedCategory === null ? "#FFFFFE" : "#78716C",
            borderRadius: "20px",
            cursor: "pointer",
            transition: "all 200ms",
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== null) {
              (e.target as HTMLButtonElement).style.backgroundColor = "#F5F3EE";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategory !== null) {
              (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
            }
          }}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            style={{
              padding: "4px 11px",
              fontSize: "11px",
              fontWeight: 500,
              border: `1px solid ${selectedCategory === category ? "#1C1917" : "#E0DCD2"}`,
              backgroundColor: selectedCategory === category ? "#1C1917" : "transparent",
              color: selectedCategory === category ? "#FFFFFE" : "#78716C",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 200ms",
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== category) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#F5F3EE";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category) {
                (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search and Sort Control */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginLeft: "16px" }}>
        <input
          type="text"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            padding: "4px 12px",
            fontSize: "12px",
            color: "#1C1917",
            border: "1px solid #E8E4DC",
            backgroundColor: "#FFFFFE",
            borderRadius: "4px",
            outline: "none",
            width: "140px",
            fontFamily: "'Inter', sans-serif",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#A8A29E", whiteSpace: "nowrap" }}>Sort by</span>
          <div style={{ position: "relative" }}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px",
              fontSize: "12px",
              color: "#78716C",
              border: "1px solid #E8E4DC",
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
              (e.target as HTMLButtonElement).style.color = "#78716C";
            }}
          >
            {sortOptions.find((opt) => opt.value === sortBy)?.label}
            <svg
              style={{
                width: "12px",
                height: "12px",
                transition: "transform 200ms",
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
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

          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: "4px",
                backgroundColor: "#FFFFFE",
                border: "1px solid #E8E4DC",
                borderRadius: "4px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
                minWidth: "128px",
              }}
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    fontSize: "12px",
                    transition: "all 200ms",
                    backgroundColor:
                      sortBy === option.value ? "#F5F3EE" : "#FFFFFE",
                    color:
                      sortBy === option.value ? "#1C1917" : "#78716C",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = "#F5F3EE";
                    (e.target as HTMLButtonElement).style.color = "#1C1917";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      sortBy === option.value ? "#F5F3EE" : "#FFFFFE";
                    (e.target as HTMLButtonElement).style.color =
                      sortBy === option.value ? "#1C1917" : "#78716C";
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
