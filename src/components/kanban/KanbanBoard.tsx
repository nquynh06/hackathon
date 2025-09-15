import React, { useEffect, useState } from "react";
import TaskFilter from "../common/TaskFilter";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { createTask, getTasks, updateTask } from "../../services/taskService.ts";
import type { Board, Task } from "../../types/index.ts";
import BoardContainer from "./BoardContainer";
import TaskCard from "./TaskCard";
import SortableBoard from "./SortableBoard";

const STORAGE_KEY = "labels_status";

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [showAddBoardPopup, setShowAddBoardPopup] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState({ status: "", priority: "", taskType: "" });

  const statusOptions = statuses;
  const priorityOptions = Array.from(new Set(tasks.map(t => t.priority))).filter(Boolean);
  const taskTypeOptions = Array.from(new Set(tasks.map(t => t.taskType))).filter(Boolean);

  useEffect(() => {
    const savedStatuses = localStorage.getItem(STORAGE_KEY);
    const loadedStatuses = savedStatuses ? JSON.parse(savedStatuses) : ["Todo", "In Progress", "Done"];
    setStatuses(loadedStatuses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedStatuses));

    let allTasks = getTasks();

    const needUpdate = allTasks.some((t) => t.order === undefined);
    if (needUpdate) {
      const grouped: Record<string, Task[]> = {};
      allTasks.forEach((t) => {
        if (!grouped[t.status]) grouped[t.status] = [];
        grouped[t.status].push(t);
      });
      Object.values(grouped).forEach((arr) => {
        arr.sort((a, b) => new Date(a.createdDate || 0).getTime() - new Date(b.createdDate || 0).getTime())
          .forEach((t, idx) => updateTask(t.id, { order: idx }));
      });
      allTasks = getTasks();
    }

    loadedStatuses.forEach((status: string) => {
      const boardTasks = allTasks.filter((t) => t.status === status);
      if (boardTasks.length === 0) {
        const emptyTask: Task = {
          id: crypto.randomUUID(),
          title: "New Task",
          status,
          boardId: status,
          taskType: "Study",
          priority: "Medium",
          order: 0,
          createdDate: new Date().toISOString(),
        };
        createTask(emptyTask);
        allTasks.push(emptyTask);
      }
    });

    setTasks(allTasks);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === String(event.active.id));
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    if (statuses.includes(String(active.id)) && statuses.includes(String(over.id))) {
      const oldIndex = statuses.indexOf(String(active.id));
      const newIndex = statuses.indexOf(String(over.id));
      const newStatuses = arrayMove(statuses, oldIndex, newIndex);
      setStatuses(newStatuses);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatuses));
      return;
    }

    const activeTaskItem = tasks.find((t) => t.id === String(active.id));
    const overTaskItem = tasks.find((t) => t.id === String(over.id));
    if (!activeTaskItem || !overTaskItem) return;

    let updatedTasks = [...tasks];

    if (activeTaskItem.status === overTaskItem.status) {
      const sameBoardTasks = tasks
        .filter((t) => t.status === activeTaskItem.status)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const oldIndex = sameBoardTasks.findIndex((t) => t.id === activeTaskItem.id);
      const newIndex = sameBoardTasks.findIndex((t) => t.id === overTaskItem.id);
      const newOrderTasks = arrayMove(sameBoardTasks, oldIndex, newIndex);

      newOrderTasks.forEach((t, idx) => updateTask(t.id, { order: idx }));
      updatedTasks = updatedTasks.map((t) =>
        t.status === activeTaskItem.status
          ? { ...t, order: newOrderTasks.findIndex(nt => nt.id === t.id) }
          : t
      );
    } else {
      const destTasks = tasks
        .filter((t) => t.status === overTaskItem.status)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const newOrder = destTasks.length;

      updateTask(activeTaskItem.id, { status: overTaskItem.status, order: newOrder });
      updatedTasks = updatedTasks.map((t) =>
        t.id === activeTaskItem.id
          ? { ...t, status: overTaskItem.status, order: newOrder }
          : t
      );
    }

    setTasks(updatedTasks);
  };

  const handleAddBoard = () => {
    setShowAddBoardPopup(true);
    setNewBoardName("");
  };

  return (
    <div style={{paddingLeft: 20, paddingRight: 20}}>
      {/* TaskFilter UI */}
      <div className="mb-2">
        <TaskFilter
          value={filter}
          onChange={setFilter}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
          taskTypeOptions={taskTypeOptions}
        />
      </div>
      <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={statuses} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 hide-scrollbar items-start">
            {statuses.map((status) => {
              const board: Board = { id: status, title: status };

              let filteredTasks = tasks.filter((t) => t.status === status);
              if (filter.priority) filteredTasks = filteredTasks.filter(t => t.priority === filter.priority);
              if (filter.taskType) filteredTasks = filteredTasks.filter(t => t.taskType === filter.taskType);
              filteredTasks = filteredTasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

              return (
                <SortableBoard key={board.id} id={board.id}>
                  <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <BoardContainer
                      board={board}
                      tasks={filteredTasks}
                      onTaskChange={() => setTasks(getTasks())}
                      onDeleteBoard={() => {
                        const newStatuses = statuses.filter((s) => s !== status);
                        setStatuses(newStatuses);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatuses));
                      }}
                    />
                  </SortableContext>
                </SortableBoard>
              );
            })}

            <div className="flex flex-col justify-start items-center mt-2">
              <button
                className="w-10 h-10 rounded-xl bg-[#03C73C] hover:bg-[#00922A] text-white text-2xl font-bold flex items-center justify-center shadow"
                onClick={handleAddBoard}
                title="Add new board"
              >
                +
              </button>
            </div>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              editable={false}
              onDelete={() => {}}
              onSave={() => {}}
              style={{ pointerEvents: "none" }}
            />
          )}
        </DragOverlay>
      </DndContext>

      {showAddBoardPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: "rgba(20,24,33,0.7)"}}>
          <div className="bg-[#242832] rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-[90vw] flex flex-col items-center border border-gray-900">
            <h3 className="text-2xl font-bold mb-6 text-white">Enter new board name</h3>
            <input
              className="border-2 border-gray-400 bg-[#222] text-white p-3 w-full text-lg rounded-xl mb-6 focus:border-green-500 outline-none placeholder-gray-500"
              value={newBoardName}
              autoFocus
              onChange={e => setNewBoardName(e.target.value)}
              placeholder="Board name..."
              onKeyDown={e => {
                if (e.key === "Enter") {
                  const trimmed = newBoardName.trim();
                  if (!trimmed || statuses.includes(trimmed)) return;
                  const newStatuses = [...statuses, trimmed];
                  setStatuses(newStatuses);
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatuses));
                  const emptyTask = {
                    id: crypto.randomUUID(),
                    title: "New Task",
                    status: trimmed,
                    boardId: trimmed,
                    taskType: "Study",
                    priority: "Medium",
                    order: 0,
                    createdDate: new Date().toISOString(),
                  };
                  createTask(emptyTask);
                  setTasks(getTasks());
                  setShowAddBoardPopup(false);
                  setNewBoardName("");
                }
                if (e.key === "Escape") {
                  setShowAddBoardPopup(false);
                  setNewBoardName("");
                }
              }}
            />
            <div className="flex gap-4 mt-2">
              <button
                className="bg-[#03C73C] text-white font-bold px-5 py-2 rounded-xl shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
                disabled={!newBoardName.trim() || statuses.includes(newBoardName.trim())}
                onClick={() => {
                  const trimmed = newBoardName.trim();
                  if (!trimmed || statuses.includes(trimmed)) return;
                  const newStatuses = [...statuses, trimmed];
                  setStatuses(newStatuses);
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatuses));
                  const emptyTask = {
                    id: crypto.randomUUID(),
                    title: "New Task",
                    status: trimmed,
                    boardId: trimmed,
                    taskType: "Study",
                    priority: "Medium",
                    order: 0,
                    createdDate: new Date().toISOString(),
                  };
                  createTask(emptyTask);
                  setTasks(getTasks());
                  setShowAddBoardPopup(false);
                  setNewBoardName("");
                }}
              >
                Create board
              </button>
              <button
                className="bg-red-700 text-white font-bold px-5 py-2 rounded-xl shadow"
                onClick={() => { setShowAddBoardPopup(false); setNewBoardName(""); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
