import React from "react";
import { BarChart, Bar, XAxis, YAxis, LabelList, Legend } from "recharts";
import type { Task } from "../../types/index";

type Props = {
  tasks: Task[];
  chartWidth?: number;
};

const wrapperStyle: React.CSSProperties = {
  background: "rgba(27,30,39,0.3)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
  borderRadius: 16,
  padding: 16,
  overflowX: "auto",
};

const DueDateBarChart: React.FC<Props> = ({ tasks, chartWidth = 700 }) => {
  const fullWidth = chartWidth * 2;

  const data = tasks.map((task) => {
    const start = task.createdDate ? new Date(task.createdDate) : new Date();
    const due = task.dueDate ? new Date(task.dueDate) : start;
    const actual = task.actualDoneDate ? new Date(task.actualDoneDate) : new Date();

    const calcDays = (from: Date, to: Date) =>
      Math.max(0, Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));

    const formatDate = (d: Date) =>
      `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;

    return {
      name: task.title,
      dueDuration: calcDays(start, due),
      actualDuration: calcDays(start, actual),
      dueDateLabel: formatDate(due),
      actualDateLabel: formatDate(actual),
    };
  });

  return (
    <div style={wrapperStyle} className="hide-scrollbar">
      <h3 className="font-semibold mb-2 text-white text-center flex justify-center items-center">
        Due Date vs Actual Completion
      </h3>
      <div style={{ minWidth: fullWidth }} className="flex justify-center items-center">
        <BarChart
          width={fullWidth}
          height={Math.max(tasks.length * 40, 300)}
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 100, bottom: 20 }}
        >
          <XAxis
            type="number"
            domain={[0, "dataMax + 5"]}
            tickFormatter={(v) => `${v} ngày`}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={120}
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y}
                dy={4}
                textAnchor="end"
                fill="#fff"
                style={{
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {payload.value}
              </text>
            )}
          />
          <Legend wrapperStyle={{ textAlign: "center", width: "100%" }} />
          <Bar dataKey="dueDuration" fill="#8452C6" name="Due Date">
            <LabelList
              dataKey="dueDateLabel"
              position="right"
              style={{ fontSize: 10, fill: "#fff" }}
            />
          </Bar>
          <Bar dataKey="actualDuration" fill="#82ca9d" name="Actual Completion">
            <LabelList
              dataKey="actualDateLabel"
              position="right"
              style={{ fontSize: 10, fill: "#fff" }}
            />
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default DueDateBarChart;
