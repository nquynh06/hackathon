import React, { useState } from "react";
import type { Board, Task } from "../../types/index.ts";
import { createTask, deleteTask, updateTask } from "../../services/taskService.ts";
import TaskCardEdit from "./TaskCardEdit";
import SortableTaskCard from "./SortableTaskCard";
import XMarkIcon from "../../icons/XMarkIcon.tsx";

const STORAGE_KEY = "labels_status";

type Props = {
  board: Board;
  tasks: Task[];
  onTaskChange: () => void;
  onDeleteBoard: () => void;
};

const BoardContainer: React.FC<Props> = ({ board, tasks, onTaskChange, onDeleteBoard }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleSaveNewTask = async (taskData: Partial<Task>) => {
    await createTask({
      title: taskData.title || "",
      priority: taskData.priority || "Medium",
      taskType: taskData.taskType || "Study",
      dueDate: taskData.dueDate,
      boardId: board.id,
      status: board.title,
      order: tasks.length,
    });
    setIsAdding(false);
    onTaskChange();
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm("Xóa task này?")) {
      await deleteTask(id);
      onTaskChange();
    }
  };

  const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
    const updated = updateTask(taskId, data); 
    if (updated) {
      setEditingTaskId(null);
      onTaskChange();
    }
  };

  const handleDeleteBoard = () => {
    if (!window.confirm(`Xóa board "${board.title}"?`)) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const labels: string[] = JSON.parse(saved);
      const newLabels = labels.filter((l) => l !== board.title);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLabels));
    }
    
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const filteredTasks = allTasks.filter((t: Task) => t.status !== board.title);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    onDeleteBoard();
  };

  return (
    <div className="flex flex-col w-72 h-full relative sm:w-64 md:w-70 lg:w-80 xl:w-[300px] min-w-[220px] max-w-full">
      <div className="flex justify-between items-center mb-2 px-1 group">
        <h2 className="font-semibold text-gray-200 text-lg truncate max-w-[70%] sm:text-base md:text-lg">{board.title}</h2>
        <button
          className="text-red-500 hover:text-red-600 text-sm font-bold px-2 py-1 rounded-full hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
          onClick={handleDeleteBoard}
          onPointerDown={e => e.stopPropagation()}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="bg-[#1B1E27] rounded-2xl shadow-lg px-2 py-2 flex flex-col border border-gray-800 h-full min-h-[220px] sm:min-h-[180px]">
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-3">
          {tasks
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onDelete={() => handleDeleteTask(task.id)}
                onEdit={() => setEditingTaskId(task.id)}
                onSave={data => handleUpdateTask(task.id, data)}
              />
            ))}
          {isAdding && (
            <TaskCardEdit
              task={{
                id: "",
                title: "",
                priority: "Medium",
                taskType: "Study",
                boardId: board.id,
                status: board.title,
              }}
              onSave={handleSaveNewTask}
              onCancel={() => setIsAdding(false)}
            />
          )}
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            onPointerDown={e => e.stopPropagation()}
            className="mt-3 py-2 px-3 rounded-xl bg-[#03C73C] hover:bg-[#00922A] text-white text-sm font-medium shadow transition w-full sm:w-auto"
          >
            + Add new task
          </button>
        )}
      </div>
      {editingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 min-w-[220px] max-w-[95vw] sm:min-w-[320px]">
            <TaskCardEdit
              task={tasks.find(t => t.id === editingTaskId)!}
              onSave={data => handleUpdateTask(editingTaskId, data)}
              onCancel={() => setEditingTaskId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );

};

export default BoardContainer;