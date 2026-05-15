import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface TrendChartProps {
  data: Array<{
    week: string;
    count: number;
    weekNumber: number;
  }>;
  skillName: string;
}

export default function TrendChart({ data, skillName }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "320px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFE",
          border: "1px solid #E8E4DC",
          borderRadius: "4px",
        }}
      >
        <span style={{ color: "#A8A29E" }}>No data available</span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "320px",
        backgroundColor: "#FFFFFE",
        border: "1px solid #E8E4DC",
        borderRadius: "4px",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="4 2"
            stroke="#F0EDE6"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            stroke="#A8A29E"
            style={{
              fontSize: "12px",
              fontFamily: "JetBrains Mono, monospace",
            }}
            tick={{ fill: "#A8A29E" }}
          />
          <YAxis
            stroke="#A8A29E"
            style={{
              fontSize: "12px",
              fontFamily: "JetBrains Mono, monospace",
            }}
            tick={{ fill: "#A8A29E" }}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active}
                payload={payload}
                label={label}
              />
            )}
            cursor={{ stroke: "#D97706", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#D97706"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: "#D97706" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
