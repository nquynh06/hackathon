import React, { useState } from "react";
import type { Task } from "../../types";
import TaskCardEdit from "../kanban/TaskCardEdit";
import TaskFieldEditor from "./TaskFieldEditor";
import { getMoods, getLastMood } from "../../services/moodService";

type EditableField = "title" | "taskType" | "dueDate" | "status" | "priority";

interface TaskTableProps {
  tasks: Task[];
  onUpdateTask: (id: string, updated: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (taskData: Omit<Task, "id">) => void;
}

const isDueOrNearDeadline = (dueDate?: string) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 1;
};

const renderLabelChip = (field: EditableField, value: string) => {
  if (!value) return "";
  const normalized = value.toLowerCase().replace(/\s+/g, "-");

  switch (field) {
    case "status":
      return <span className={`label-chip status-${normalized}`}>{value}</span>;
    case "priority":
      return <span className={`label-chip priority-${normalized}`}>{value}</span>;
    case "taskType":
      return <span className={`label-chip tasktype-${normalized}`}>{value}</span>;
    default:
      return value;
  }
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onUpdateTask, onDeleteTask, onAddTask }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [editing, setEditing] = useState<{ id: string; field: EditableField } | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const moods = getMoods();
  const lastMood = getLastMood();

  const handleCellClick = (task: Task, field: EditableField) => {
    setEditing({ id: task.id, field });
    setTempValue(task[field] ? String(task[field]) : "");
  };

  const handleSave = () => {
    if (editing) {
      onUpdateTask(editing.id, { [editing.field]: tempValue });
      setEditing(null);
      setTempValue("");
    }
  };

  return (
    <>
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-[#141821] border-b border-[#1B1E27] text-[#70727E] px-2 py-3">
            <th className="px-2 py-3">Title</th>
            <th className="px-2 py-3">Type</th>
            <th className="px-2 py-3">Due Date</th>
            <th className="px-2 py-3">Status</th>
            <th className="px-2 py-3">Priority</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const taskMood = moods.find((m) => m.label === task.mood);
            const moodActive = lastMood && task.mood === lastMood;
            const defaultBg = moodActive && taskMood ? taskMood.color : "transparent";
            const isHovered = hoveredRowId === task.id;

            return (
              <tr
                key={task.id}
                onMouseEnter={() => setHoveredRowId(task.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                style={{ background: isHovered ? "#03C73C" : defaultBg }}
                className="transition-colors duration-200 border-b border-[#1B1E27] cursor-pointer"
              >
                {(["title", "taskType", "dueDate", "status", "priority"] as EditableField[]).map((field) => (
                  <td
                    key={field}
                    className={`px-2 py-4 break-words whitespace-normal ${
                      field === "dueDate" && isDueOrNearDeadline(task.dueDate)
                        ? "text-red-500 font-bold"
                        : ""
                    }`}
                    onClick={() => handleCellClick(task, field)}
                  >
                    {editing?.id === task.id && editing?.field === field ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <TaskFieldEditor
                          field={field}
                          value={String(task[field] || "")}
                          onSave={(newValue) => {
                            onUpdateTask(task.id, { [field]: newValue });
                            setEditing(null);
                          }}
                          onCancel={() => setEditing(null)}
                        />
                      </div>
                    ) : (
                      renderLabelChip(field, String(task[field] || ""))
                    )}
                  </td>
                ))}
              </tr>
            );
          })}

          {/* Add new task button triggers popup */}
          <tr>
            <td colSpan={7}>
              <button
                className="w-full text-left px-2 py-1 text-[#70727E]"
                onClick={() => setShowPopup(true)}
              >
                + Add new Task
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Popup for add task */}
      {showPopup && (
        <TaskCardEdit
          task={{
            id: "",
            title: "",
            priority: "Medium",
            taskType: "Study",
            boardId: "",
            status: "Todo",
          }}
          onSave={data => {
            onAddTask({
              ...data,
              boardId: data.boardId || "",
              status: data.status || "Todo",
              priority: data.priority || "Medium",
              taskType: data.taskType || "Study",
            } as Omit<Task, "id">);
            setShowPopup(false);
          }}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default TaskTable;
