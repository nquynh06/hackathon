import React from "react";
import { PieChart, Pie, Cell, Label, Tooltip } from "recharts";
import type { Task } from "../../types/index";

const DEFAULT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

type Props = {
  tasks: Task[];
  width?: number;
};

const StatusPieChart: React.FC<Props> = ({ tasks, width = 400 }) => {
  const uniqueStatuses = Array.from(new Set(tasks.map((t) => t.status)));
  const data = uniqueStatuses.map((status) => ({
    name: status,
    value: tasks.filter((t) => t.status === status).length,
  }));

  const COLORS = [
    ...DEFAULT_COLORS,
    ...Array(Math.max(0, data.length - DEFAULT_COLORS.length)).fill(0).map(getRandomColor)
  ];

  return (
    <div
      style={{
        background: "rgba(27,30,39,0.3)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width,
      }}
    >
      <h3 className="font-semibold mb-2 text-white text-center">Tasks by Status</h3>
      <PieChart width={width} height={width}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          label
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
          <Label
            value={tasks.length}
            position="center"
            className="text-lg font-bold text-white"
          />
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default StatusPieChart;
