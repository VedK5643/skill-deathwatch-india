import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface CompareChartProps {
  data: Array<{
    week: string;
    skillA: number;
    skillB: number;
  }>;
  skillAName: string;
  skillBName: string;
}

export default function CompareChart({
  data,
  skillAName,
  skillBName,
}: CompareChartProps) {
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
        backgroundColor: "#FFFFFE",
        border: "1px solid #E8E4DC",
        borderRadius: "4px",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ height: "400px" }}>
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
            <Legend
              wrapperStyle={{
                paddingTop: "16px",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
              }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="skillA"
              name={skillAName}
              stroke="#2563EB"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: "#2563EB" }}
            />
            <Line
              type="monotone"
              dataKey="skillB"
              name={skillBName}
              stroke="#D97706"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: "#D97706" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
