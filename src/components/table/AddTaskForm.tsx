import React, { useState } from "react";
import type { Task } from "../../types";

interface AddTaskFormProps {
  onAddTask: (taskData: Omit<Task, "id">) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [boardId, setBoardId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({ title, taskType, status, priority, dueDate, boardId });
    setTitle("");
    setTaskType("");
    setStatus("Todo");
    setPriority("Medium");
    setDueDate("");
    setBoardId("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2">
      <input required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border px-2 py-1" />
      <input placeholder="Type" value={taskType} onChange={e => setTaskType(e.target.value)} className="border px-2 py-1" />
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="border px-2 py-1" />
      <select value={status} onChange={e => setStatus(e.target.value)} className="border px-2 py-1">
        <option>Todo</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
      <select value={priority} onChange={e => setPriority(e.target.value)} className="border px-2 py-1">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <input placeholder="Board ID" value={boardId} onChange={e => setBoardId(e.target.value)} className="border px-2 py-1" />
      <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Add</button>
    </form>
  );
};

export default AddTaskForm;
