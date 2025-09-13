import React, { useState } from "react";
import type { Task } from "/workspaces/hackathon/src/types/index.ts";

type Props = {
  task: Task;
  onSave: (data: Partial<Task>) => void;
  onCancel: () => void;
};

const TaskCardEdit: React.FC<Props> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task.title || "");
  const [priority, setPriority] = useState(task.priority || "Medium");
  const [taskType, setTaskType] = useState(task.taskType || "General");
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  return (
    <div
      className="bg-white p-2 rounded shadow space-y-2"
      onPointerDown={(e) => e.stopPropagation()} // Ngăn drag board khi đang edit/add task
    >
      <input
        className="border p-1 w-full text-sm rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="border p-1 w-full text-sm rounded"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <select
        className="border p-1 w-full text-sm rounded"
        value={taskType}
        onChange={(e) => setTaskType(e.target.value)}
      >
        <option>General</option>
        <option>Bug</option>
        <option>Feature</option>
      </select>
      <input
        type="date"
        className="border p-1 w-full text-sm rounded"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button
          className="text-sm px-2 py-1 bg-gray-200 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => onSave({ title, priority, taskType, dueDate })}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TaskCardEdit;