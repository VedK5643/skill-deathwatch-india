interface SparkLineProps {
  data: number[];
  trend?: "up" | "down" | "flat";
}

export default function SparkLine({ data, trend = "flat" }: SparkLineProps) {
  if (!data || data.length === 0) {
    return <svg className="sparkline" viewBox="0 0 160 32" />;
  }

  // Min-max normalize the data to fit within viewBox with 2px padding
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const padding = 2;
  const viewBoxHeight = 32;
  const viewBoxWidth = 160;
  const chartHeight = viewBoxHeight - padding * 2;
  const chartWidth = viewBoxWidth - padding * 2;

  // Create points for polyline
  const points = data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const normalizedValue = (value - min) / range;
      const y = padding + chartHeight - normalizedValue * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  // Determine stroke color based on trend
  let strokeColor = "#D6D3D1"; // neutral (warm stone)
  if (trend === "up") {
    strokeColor = "#16A34A"; // green
  } else if (trend === "down") {
    strokeColor = "#DC2626"; // red
  }

  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
