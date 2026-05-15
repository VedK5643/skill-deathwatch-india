interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color?: string;
  }>;
  label?: string;
  weekOverWeekChange?: number;
}

export default function CustomTooltip({
  active,
  payload,
  label,
  weekOverWeekChange,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <div
      style={{
        backgroundColor: "#1C1917",
        border: "1px solid #3C3730",
        borderRadius: "6px",
        padding: "8px 12px",
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
      }}
    >
      <p style={{ fontSize: "12px", color: "#A8A29E", marginBottom: "8px" }}>{label}</p>
      {payload.map((entry, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          {entry.color && (
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: entry.color,
              }}
            ></div>
          )}
          <span style={{ fontSize: "12px", color: "#F5F3EE" }}>{entry.name}:</span>
          <span
            style={{
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "#F5F3EE",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatNumber(entry.value)}
          </span>
        </div>
      ))}
      {weekOverWeekChange !== undefined && (
        <div
          style={{
            marginTop: "8px",
            paddingTop: "8px",
            borderTop: "1px solid #3C3730",
          }}
        >
          <span style={{ fontSize: "11px", color: "#A8A29E" }}>Week-over-week: </span>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              color:
                weekOverWeekChange > 0
                  ? "#16A34A"
                  : weekOverWeekChange < 0
                    ? "#DC2626"
                    : "#A8A29E",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {weekOverWeekChange > 0 ? "+" : ""}
            {weekOverWeekChange.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
