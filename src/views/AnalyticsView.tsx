import React, { useEffect, useState } from "react";
import type { Task } from "../types";
import { getTasks } from "../services/taskService";
import { getMoodHistory } from "../services/moodService";

import StatusPieChart from "../components/analytics/StatusPieChart";
import PriorityBarChart from "../components/analytics/PriorityBarChart";
import DueDateBarChart from "../components/analytics/DueDateBarChart";
import MoodScatterChart from "../components/analytics/MoodScatterChart";

const AnalyticsView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);

  useEffect(() => {
    setTasks(getTasks());
    setMoodHistory(getMoodHistory());
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at center, #066722ff 0%, #141821 60%)", padding: "20px" }}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-gray-300">Overview of your tasks and moods</p>
      </div>

      {/* Row 1 */}
      <div className="flex justify-center flex-wrap mb-6 gap-12">
        <StatusPieChart tasks={tasks} />
        <PriorityBarChart tasks={tasks} />
      </div>

      {/* Row 2 */}
      <div className="mt-8">
        <DueDateBarChart tasks={tasks} />
      </div>

      {/* Row 3 */}
      <div className="mt-8">
        <MoodScatterChart moodHistory={moodHistory} />
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsView;
