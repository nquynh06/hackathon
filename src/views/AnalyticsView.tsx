import React, { useEffect, useState } from "react";
import type { Task } from "../types";
import { getTasks } from "../services/taskService";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  LabelList,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  // Tạo danh sách status động
  const uniqueStatuses = Array.from(new Set(tasks.map((t) => t.status)));
  const statusData = uniqueStatuses.map((status) => ({
    name: status,
    value: tasks.filter((t) => t.status === status).length,
  }));

  // Tạo danh sách priority động
  const uniquePriorities = Array.from(new Set(tasks.map((t) => t.priority)));
  const priorityData = uniquePriorities.map((priority) => ({
    name: priority,
    value: tasks.filter((t) => t.priority === priority).length,
  }));

  // Tính Late / On Time / Early
  const lateTasks = tasks.filter(
    (t) =>
      t.status === "Done" &&
      t.actualDoneDate &&
      t.dueDate &&
      new Date(t.actualDoneDate) > new Date(t.dueDate)
  ).length;

  const onTimeTasks = tasks.filter(
    (t) =>
      t.status === "Done" &&
      t.actualDoneDate &&
      t.dueDate &&
      new Date(t.actualDoneDate).toDateString() ===
        new Date(t.dueDate).toDateString()
  ).length;

  const earlyTasks = tasks.filter(
    (t) =>
      t.status === "Done" &&
      t.actualDoneDate &&
      t.dueDate &&
      new Date(t.actualDoneDate) < new Date(t.dueDate)
  ).length;

  // Chuẩn bị dữ liệu Due Date vs Actual Completion
  const dueDateData = tasks.map((task) => {
    const start = task.createdDate
      ? new Date(task.createdDate)
      : task.startDate
      ? new Date(task.startDate)
      : new Date();

    const due = task.dueDate ? new Date(task.dueDate) : start;
    const actual = task.actualDoneDate ? new Date(task.actualDoneDate) : null;
    const today = new Date();

    // Duration đến dueDate
    const dueDuration =
      (due.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    // Duration thực tế: chạy đến ngày Done hoặc hôm nay nếu chưa Done
    const actualDuration = actual
      ? (actual.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      : (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    const formatDate = (d: Date) =>
      `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;

    return {
      name: task.title,
      dueDuration: Math.max(0, Math.round(dueDuration)),
      actualDuration: Math.max(0, Math.round(actualDuration)),
      dueDateLabel: formatDate(due),
      actualDateLabel: actual ? formatDate(actual) : formatDate(today),
    };
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Analytics</h2>

      {/* 3 ô tổng hợp */}
      <div className="flex gap-4 mb-6">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded font-semibold">
          Late: {lateTasks}
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded font-semibold">
          On Time: {onTimeTasks}
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-semibold">
          Early: {earlyTasks}
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <div>
          <h3 className="font-semibold mb-2">Tasks by Status</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              label
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                value={tasks.length}
                position="center"
                className="text-lg font-bold"
              />
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Tasks by Priority</h3>
          <BarChart width={300} height={300} data={priorityData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-2">
            Due Date vs Actual Completion (days)
          </h3>
          <BarChart
            width={700}
            height={tasks.length * 60}
            data={dueDateData}
            layout="vertical"
            margin={{ top: 20, right: 60, left: 150, bottom: 20 }}
          >
            <XAxis
              type="number"
              domain={[0, "dataMax + 5"]}
              tickFormatter={(value) =>
                value === 1 ? "1 ngày" : `${value} ngày`
              }
            />
            <YAxis dataKey="name" type="category" width={200} />
            {/* Bỏ Tooltip ở đây */}
            <Legend />
            <Bar dataKey="dueDuration" fill="#8884d8" name="Due Date">
              <LabelList
                dataKey="dueDateLabel"
                position="right"
                style={{ fontSize: 12, fill: "#333" }}
              />
            </Bar>
            <Bar
              dataKey="actualDuration"
              fill="#82ca9d"
              name="Actual Completion"
            >
              <LabelList
                dataKey="actualDateLabel"
                position="right"
                style={{ fontSize: 12, fill: "#333" }}
              />
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
