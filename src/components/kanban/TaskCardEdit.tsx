import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import type { Task, Requirement } from "../../types/index.ts";
import PomodoroPage from "./PomodoroPage";
import { getMoods } from "../../services/moodService";

type Props = {
  task: Task;
  onSave: (data: Partial<Task>) => void;
  onCancel: () => void;
};

const TaskCardEdit: React.FC<Props> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task.title || "");
  const [priority, setPriority] = useState(task.priority || "Medium");
  const [taskType, setTaskType] = useState(task.taskType || "Study");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [requirements, setRequirements] = useState<Requirement[]>(task.requirements || []);
  const [newReq, setNewReq] = useState("");
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [mood, setMood] = useState(task.mood || "");

  const moods = getMoods();

  const handleAddRequirement = () => {
    const text = newReq.trim();
    if (!text) return;
    setRequirements([...requirements, { id: crypto.randomUUID(), text, done: false }]);
    setNewReq("");
  };

  const handleToggleReq = (id: string) => {
    setRequirements(requirements.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  const handleRemoveReq = (id: string) => {
    setRequirements(requirements.filter(r => r.id !== id));
  };

  const allDone = requirements.length > 0 && requirements.every(r => r.done);

  const renderListbox = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    options: string[],
    type: "priority" | "tasktype" | "mood"
  ) => (
    <Listbox value={value} onChange={setValue}>
      <div className="relative">
        <Listbox.Button className="w-full text-left outline-none focus:outline-none">
          {value ? (
            <span className={`label-chip ${type}-${value.toLowerCase()}`}>{value}</span>
          ) : (
            <span className="text-gray-400">{label}</span>
          )}
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-2 w-max min-w-full rounded-2xl bg-[#141821] shadow-2xl border border-gray-900 z-30 py-2 flex flex-col gap-2"
          style={{maxHeight: 'none', overflow: 'visible'}}
        >
          {options.map(opt => (
            <Listbox.Option
              key={opt}
              value={opt}
              className={({ active }) =>
                `cursor-pointer select-none px-4 py-2 rounded-xl mx-2 font-semibold flex items-center gap-2 ${
                  active ? "bg-[#03C73C] text-black" : "text-gray-100"
                }`
              }
            >
              <span className={`label-chip ${type}-${opt.toLowerCase()}`}>{opt}</span>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );

  const inputUnderlineClass =
    "w-full text-sm bg-transparent placeholder-gray-500 focus:border-b focus:border-gray-500 outline-none py-1";

  const dateUnderlineClass =
    "w-full text-sm bg-transparent outline-none py-1 text-gray-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ pointerEvents: "auto" }}
      onPointerDown={e => e.stopPropagation()}
      onKeyDown={e => e.stopPropagation()} 
    >
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, background: "rgba(20,24,33,0.7)" }}
        onPointerDown={e => e.stopPropagation()}
      ></div>
      <div
        className="relative z-10 flex items-center justify-center w-full h-full"
        onPointerDown={e => e.stopPropagation()}
      >
        <div
          className="bg-[#1B1E27] rounded-3xl shadow-2xl p-8 min-w-[400px] max-w-[700px] border-1 border-gray-900 space-y-4 relative"
          style={{ pointerEvents: "auto" }}
          onPointerDown={e => e.stopPropagation()}
        >
          {/* Pomodoro button */}
          <button
            className="absolute top-4 right-6 bg-red-500 text-white px-3 py-1 rounded-xl shadow"
            onClick={() => setShowPomodoro(true)}
            type="button"
            style={{ zIndex: 10 }}
          >
            Promodoro
          </button>

          <h3 className="text-lg font-semibold text-gray-400 mb-2 border-b border-gray-600 pb-3">
            Edit Task
          </h3>

          {/* Task Title */}
          <div className="mt-5">
            <label className="text-xs text-gray-400 mb-1 block">Task Title</label>
            <input
              className={inputUnderlineClass}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter task title..."
              onPointerDown={e => e.stopPropagation()}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Due Date</label>
            <input
              type="date"
              className={dateUnderlineClass}
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              onPointerDown={e => e.stopPropagation()}
            />
          </div>

          {/* Labels */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-24 text-gray-400 text-xs">Priority</span>
              {renderListbox("Priority", priority, setPriority, ["Low", "Medium", "High"], "priority")}
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-gray-400 text-xs">Task Type</span>
              {renderListbox("Task Type", taskType, setTaskType, ["Study", "Work", "Life"], "tasktype")}
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-gray-400 text-xs">Mood</span>
              {renderListbox(
                "Mood",
                mood,
                setMood,
                moods.map(m => m.label),
                "mood"
              )}
            </div>
          </div>

          {/* Requirements section */}
          <div className="mt-10">
            <label className="text-xs text-gray-400 mb-1 block">Requirements</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputUnderlineClass}
                value={newReq}
                onChange={e => setNewReq(e.target.value)}
                placeholder="Add a new requirement..."
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddRequirement(); } }}
                onPointerDown={e => e.stopPropagation()}
              />
              <button
                className="bg-[#03C73C] text-white px-3 py-1 rounded"
                onClick={handleAddRequirement}
                onPointerDown={e => e.stopPropagation()}
                type="button"
              >
                +
              </button>
            </div>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {requirements.map(req => (
                <li key={req.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={req.done}
                    onChange={() => handleToggleReq(req.id)}
                    onPointerDown={e => e.stopPropagation()}
                  />
                  <span className={req.done ? "line-through text-gray-400" : ""}>{req.text}</span>
                  <button
                    className="text-xs text-red-500 ml-2"
                    onClick={() => handleRemoveReq(req.id)}
                    onPointerDown={e => e.stopPropagation()}
                    type="button"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Save / Cancel / Done */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="text-sm px-3 py-1 bg-[#70727E] rounded-xl"
              onClick={onCancel}
              onPointerDown={e => e.stopPropagation()}
            >
              Cancel
            </button>
            <button
              className="text-sm px-3 py-1 bg-[#03C73C] text-white rounded-xl"
              onClick={() => onSave({ title, priority, taskType, dueDate, requirements, mood })}
              onPointerDown={e => e.stopPropagation()}
            >
              Save
            </button>
            {allDone && (
              <button
                className="text-sm px-3 py-1 bg-green-600 text-white rounded"
                onClick={() =>
                  onSave({ title, priority, taskType, dueDate, requirements, status: "Done", mood })
                }
                onPointerDown={e => e.stopPropagation()}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pomodoro popup */}
      {showPomodoro && (
        <PomodoroPage
          boardTitle={task.status}
          taskTitle={title}
          requirements={requirements}
          onTickRequirement={id =>
            setRequirements(reqs =>
              reqs.map(r => (r.id === id ? { ...r, done: !r.done } : r))
            )
          }
          onClose={() => setShowPomodoro(false)}
          onAllDone={() => setShowPomodoro(false)}
        />
      )}
    </div>
  );
};

export default TaskCardEdit;
