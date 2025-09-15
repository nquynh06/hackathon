import React, { useState } from "react";
import type { Task } from "../../types/index.ts";

type Props = {
  task: Task;
  onDelete: () => void;
  onSave: (updated: Partial<Task>) => void;
};

const isDueOrOverdue = (dueDate?: string) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due <= today;
};

const TaskCardDisplay: React.FC<Props> = ({ task, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hover, setHover] = useState(false);

  if (isEditing) {
    return null;
  }

  return (
    <div
      className="bg-white p-2 rounded shadow relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p className="font-medium">{task.title}</p>
      {task.dueDate && (
        <p
          className={`text-xs ${
            isDueOrOverdue(task.dueDate) ? "text-red-500 font-bold" : "text-gray-500"
          }`}
        >
          Due: {task.dueDate}
        </p>
      )}
      <p className="text-xs text-gray-600">{task.priority} • {task.taskType}</p>

      {hover && (
        <div className="absolute top-1 right-1 flex gap-1">
          <button
            className="text-xs px-1 bg-gray-200 rounded"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="text-xs px-1 bg-red-200 rounded"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCardDisplay;