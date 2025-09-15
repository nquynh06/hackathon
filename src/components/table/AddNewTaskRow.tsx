import React, { useState } from "react";
import type { Task } from "../../types";
import { getMoods } from "../../services/moodService";

interface AddNewTaskRowProps {
  onAddTask: (taskData: Omit<Task, "id">) => void;
  onCancel: () => void;
}

const AddNewTaskRow: React.FC<AddNewTaskRowProps> = ({ onAddTask, onCancel }) => {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("Study");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [boardId, setBoardId] = useState("");
  const [mood, setMood] = useState("");

  const moods = getMoods();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({ title, taskType, status, priority, dueDate, boardId, mood });
    // reset inputs
    setTitle(""); setTaskType("Study"); setStatus("Todo"); setPriority("Medium"); setDueDate(""); setMood("");
  };

  return (
    <tr>
      <td className="border px-2 py-1">
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-1 py-0.5" />
      </td>
      <td className="border px-2 py-1">
        <select value={taskType} onChange={e => setTaskType(e.target.value)} className="w-full border px-1 py-0.5">
          <option>Study</option>
          <option>Work</option>
          <option>Life</option>
        </select>
        <span className={`label-chip tasktype-${(taskType || "study").toLowerCase().replace(/\s/g, "")}`}>{taskType}</span>
      </td>
      <td className="border px-2 py-1">
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border px-1 py-0.5" />
      </td>
      <td className="border px-2 py-1">
        <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border px-1 py-0.5">
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </td>
      <td className="border px-2 py-1">
        <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border px-1 py-0.5">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <span className={`label-chip priority-${(priority || "medium").toLowerCase()}`}>{priority}</span>
      </td>
      <td className="border px-2 py-1 flex space-x-2">
        <button className="text-green-500" onClick={handleSubmit}>Add</button>
        <button className="text-gray-500" onClick={onCancel}>Cancel</button>
      </td>
    </tr>
  );
};

export default AddNewTaskRow;
