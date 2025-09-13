import React, { useState } from "react";
import type { Task } from "/workspaces/hackathon/src/types/index.ts";
import TaskCard from "./TaskCard";

type Props = {
  task: Task;
  onDelete: () => void;
  onSave: (updated: Partial<Task>) => void;
};

const TaskCardDisplay: React.FC<Props> = ({ task, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hover, setHover] = useState(false);

  if (isEditing) {
    // Không dùng nữa, logic edit đã chuyển sang BoardContainer
    return null;
  }

  return (
    <div
      className="bg-white p-2 rounded shadow relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p className="font-medium">{task.title}</p>
      {task.dueDate && <p className="text-xs text-gray-500">Due: {task.dueDate}</p>}
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