import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import type { Task } from "../../types/index";

type Props = {
  tasks: Task[];
  width?: number;
};

const PriorityBarChart: React.FC<Props> = ({ tasks, width = 400 }) => {
  const uniquePriorities = Array.from(new Set(tasks.map((t) => t.priority)));
  const data = uniquePriorities.map((priority) => ({
    name: priority,
    value: tasks.filter((t) => t.priority === priority).length,
  }));

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
      <h3 className="font-semibold mb-2 text-white text-center">Tasks by Priority</h3>
      <BarChart width={width} height={width} data={data}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8452C6" />
      </BarChart>
    </div>
  );
};

export default PriorityBarChart;
