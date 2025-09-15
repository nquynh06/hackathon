import React, { useState } from "react";
import type { Task } from "../../types/index.ts";
import TaskCardEdit from "./TaskCardEdit";
import { getMoods, getLastMood } from "../../services/moodService";

const isDueOrNearDeadline = (dueDate?: string) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 1;
};

type Props = {
  task: Task;
  editable: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onSave: (taskData: Partial<Task>) => void;
  onCancel?: () => void;
  dragRef?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
  listeners?: any;
  attributes?: any;
};

const TaskCard: React.FC<Props> = ({
  task,
  onDelete,
  onEdit,
  onSave,
  dragRef,
  style,
  listeners,
  attributes,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [editing, setEditing] = useState(false);
  const dragProps = !menuOpen && !editing ? { ...listeners, ...attributes } : {};
  const handleSave = (data: Partial<Task>) => {
    setEditing(false);
    if (typeof onSave === 'function') {
      onSave(data);
    }
  };

  const moods = getMoods();
  const lastMood = getLastMood();
  const taskMood = moods.find(m => m.label === task.mood);
  const moodActive = lastMood && task.mood === lastMood;
  const bgColor = moodActive && taskMood ? taskMood.color : "#141821";

  return (
    <>
      <div
        ref={dragRef}
        style={{ ...style, background: bgColor }}
        className="bg-[#141821] w-full p-4 my-3 rounded-2xl border border-gray-800 shadow-sm flex flex-col group relative hover:shadow-md transition"
        {...dragProps}
      >
        {(onEdit || onDelete) && (
          <div className="absolute top-2 right-2 z-10">
            <button
              className="hidden group-hover:flex w-7 h-7 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-700"
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              &#x2026;
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-black rounded-2xl shadow-lg py-1 text-sm">
                {onEdit && (
                  <button
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setEditing(true); }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete && onDelete(); }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >Delete</button>
                )}
              </div>
            )}
          </div>
        )}

  <p className="font-medium text-white break-words whitespace-normal mb-2">{task.title}</p>
  {task.requirements && task.requirements.length > 0 && (
          <div className="w-full mt-2 mb-1">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-2 bg-green-500 transition-all"
                style={{
                  width: `${
                    100 *
                    (task.requirements.filter(r => r.done).length / task.requirements.length)
                  }%`
                }}
              />
            </div>
            <div className="text-xs text-gray-300 mt-1 text-right">
              {task.requirements.filter(r => r.done).length}/{task.requirements.length} done
            </div>
          </div>
        )}
        {task.dueDate && (
          <p
            className={`text-xs mb-2 ${isDueOrNearDeadline(task.dueDate) ? "text-red-500 font-bold" : "text-[#70727E]"}`}
          >
            Due: {task.dueDate}
          </p>
        )}
        <div className="flex gap-2 mt-2">
          <span className={`label-chip priority-${(task.priority || "medium").toLowerCase()}`}>{task.priority}</span>
          <span className={`label-chip tasktype-${(task.taskType || "study").toLowerCase().replace(/\s/g, "")}`}>{task.taskType}</span>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 min-w-[320px] max-w-[90vw]">
            <TaskCardEdit
              task={task}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
