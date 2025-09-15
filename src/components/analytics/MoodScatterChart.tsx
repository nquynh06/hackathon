import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend } from "recharts";

type MoodEntry = {
  label: string;
  timestamp: string;
  color: string;
};

type Props = {
  moodHistory: MoodEntry[];
  chartWidth?: number;
};

const wrapperStyle: React.CSSProperties = {
  background: "rgba(27,30,39,0.3)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
  borderRadius: 16,
  padding: 16,
  overflowX: "auto",
};

const MoodScatterChart: React.FC<Props> = ({ moodHistory, chartWidth = 700 }) => {
  const fullWidth = chartWidth * 2;

  const moodChartData = moodHistory.map((item) => {
    const dateObj = new Date(item.timestamp);
    return {
      ...item,
      date: dateObj.toLocaleDateString(),
      hour: dateObj.getHours() + dateObj.getMinutes() / 60,
      timeLabel: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  });

  const uniqueMoodLabels = Array.from(new Set(moodChartData.map((m) => m.label)));
  const moodColorMap: Record<string, string> = {};
  moodChartData.forEach((m) => { moodColorMap[m.label] = m.color; });

  return (
    <div style={wrapperStyle} className="hide-scrollbar">
      <h3 className="font-semibold mb-2 text-white text-center flex justify-center items-center">Mood Mode Over Time</h3>
      <div style={{ minWidth: fullWidth }} className="flex justify-center items-center">
        <ScatterChart
          width={fullWidth}
          height={300}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="date"
            type="category"
            allowDuplicatedCategory={false}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            dataKey="hour"
            type="number"
            domain={[0, 24]}
            tickFormatter={(v) => `${Math.floor(v)}h`}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(_, __, props: any) => `${props.payload.label} (${props.payload.timeLabel})`}
          />
          <Legend wrapperStyle={{ textAlign: "center", width: "100%" }} />
          {uniqueMoodLabels.map((label) => (
            <Scatter
              key={label}
              name={label}
              data={moodChartData.filter((m) => m.label === label)}
              fill={moodColorMap[label]}
              shape="circle"
            />
          ))}
        </ScatterChart>
      </div>
    </div>
  );
};

export default MoodScatterChart;
