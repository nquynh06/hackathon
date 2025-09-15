import React, { useEffect, useState } from "react";
import type { Task } from "../types";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import TaskTable from "../components/table/TaskTable";
import TaskFilter from "../components/common/TaskFilter";
import type { TaskFilterValues } from "../components/common/TaskFilter";

const TableView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilterValues>({ status: "", priority: "", taskType: "" });

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const handleAddTask = (taskData: Omit<Task, "id">) => {
    createTask(taskData);
    setTasks(getTasks());
  };

  const handleUpdateTask = (id: string, updated: Partial<Task>) => {
    updateTask(id, updated);
    setTasks(getTasks());
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setTasks(getTasks());
  };

  const filteredTasks = tasks.filter(
    (t) =>
      (!filter.status || t.status === filter.status) &&
      (!filter.priority || t.priority === filter.priority) &&
      (!filter.taskType || t.taskType === filter.taskType)
  );

  const statusOptions = Array.from(new Set(tasks.map(t => t.status)));
  const priorityOptions = Array.from(new Set(tasks.map(t => t.priority)));
  const taskTypeOptions = Array.from(new Set(tasks.map(t => t.taskType)));

  return (
    <div>
      <TaskFilter
        value={filter}
        onChange={setFilter}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        taskTypeOptions={taskTypeOptions}
      />
      <div className="overflow-x-auto hide-scrollbar">
        <div className="min-w-[1440px]">
      <TaskTable
        tasks={filteredTasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onAddTask={handleAddTask}
      />
      </div>
      </div>
    </div>
  );
};

export default TableView;
