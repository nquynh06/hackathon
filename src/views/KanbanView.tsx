import React, { useState, useEffect } from "react";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TaskFilter from "../components/common/TaskFilter";
import type { TaskFilterValues } from "../components/common/TaskFilter";
import { getTasks } from "../services/taskService";

const KanbanView: React.FC = () => {
  const [filter, setFilter] = useState<TaskFilterValues>({ status: "", priority: "", taskType: "" });
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [priorityOptions, setPriorityOptions] = useState<string[]>([]);
  const [taskTypeOptions, setTaskTypeOptions] = useState<string[]>([]);

  useEffect(() => {
    const tasks = getTasks();
    setStatusOptions(Array.from(new Set(tasks.map(t => t.status)).values()));
    setPriorityOptions(Array.from(new Set(tasks.map(t => t.priority)).values()));
    setTaskTypeOptions(Array.from(new Set(tasks.map(t => t.taskType)).values()));
  }, []);

  return (
    <div className="h-full w-full p-4 bg-[#242424]">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <TaskFilter
        value={filter}
        onChange={setFilter}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        taskTypeOptions={taskTypeOptions}
      />
      <KanbanBoard filter={filter} />
    </div>
  );
};

export default KanbanView;
